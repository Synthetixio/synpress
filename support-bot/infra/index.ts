import * as gcp from '@pulumi/gcp'
import * as pulumi from '@pulumi/pulumi'

// Get GCP configuration
const gcpConfig = new pulumi.Config('gcp')
const projectId = gcpConfig.require('project')
const zone = gcpConfig.require('zone')
const region = gcpConfig.require('region')

// Create a new network
const network = new gcp.compute.Network('synpress-support-bot-network', {
  autoCreateSubnetworks: true
})

// Create a firewall rule to allow incoming traffic
const firewall = new gcp.compute.Firewall('synpress-support-bot-firewall', {
  network: network.name,
  allows: [
    {
      protocol: 'tcp',
      ports: ['22']
    }
  ],
  sourceRanges: ['0.0.0.0/0'],
  targetTags: ['synpress-support-bot']
})

// Create a service account for the VM
const serviceAccount = new gcp.serviceaccount.Account('synpress-support-bot-sa', {
  accountId: 'synpress-support-bot-sa',
  displayName: 'Synpress Support Bot Service Account'
})

// Add necessary IAM roles to the service account
const roles = [
  'roles/logging.logWriter',
  'roles/monitoring.metricWriter',
  'roles/monitoring.viewer',
  'roles/stackdriver.resourceMetadata.writer'
]

roles.forEach((role, i) => {
  new gcp.projects.IAMBinding(`synpress-support-bot-iam-binding-${i}`, {
    project: projectId,
    role: role,
    members: [pulumi.interpolate`serviceAccount:${serviceAccount.email}`]
  })
})

const instanceStartupScript = pulumi.interpolate`#!/bin/bash
        set -e  # Exit on error
        set -x  # Print commands for debugging

        echo "Starting installation process..."
        # Install Node.js and npm
        curl -fsSL https://deb.nodesource.com/setup_22.x | bash -
        apt-get install -y nodejs

        # Install pnpm
        npm install -g pnpm

        # Create app directory
        mkdir -p /opt/support-bot
        cd /opt/support-bot

        # Clone repo
        git clone https://github.com/Synthetixio/synpress.git
        cd synpress
        git checkout dev

        # Install dependencies and start the bot
        pnpm install
        cd support-bot
        pnpm build
        pnpm start
`

// Create a VM instance
const instance = new gcp.compute.Instance('synpress-support-bot-instance', {
  machineType: 'e2-micro',
  zone: zone,
  bootDisk: {
    initializeParams: {
      image: 'ubuntu-os-cloud/ubuntu-2004-lts',
      size: 10,
      type: 'pd-ssd', // Use SSD
      labels: {
        environment: 'production',
        managed_by: 'pulumi',
        application: 'synpress-support-bot'
      }
    },
    autoDelete: true,
    deviceName: 'synpress-support-bot-boot-disk'
  },
  networkInterfaces: [
    {
      network: network.name
    }
  ],
  serviceAccount: {
    email: serviceAccount.email,
    scopes: ['https://www.googleapis.com/auth/cloud-platform']
  },
  metadataStartupScript: instanceStartupScript,
  labels: {
    environment: 'production',
    managed_by: 'pulumi',
    application: 'synpress-support-bot'
  },
  tags: ['synpress-support-bot']
})

// Create a Cloud Storage bucket for bot data and logs
const bucket = new gcp.storage.Bucket('synpress-support-bot-bucket', {
  location: region,
  uniformBucketLevelAccess: true
})

// Grant the service account access to the bucket
const bucketIAM = new gcp.storage.BucketIAMMember('synpress-support-bot-bucket-iam', {
  bucket: bucket.name,
  role: 'roles/storage.objectViewer',
  member: pulumi.interpolate`serviceAccount:${serviceAccount.email}`
})
