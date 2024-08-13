/*
 * Copyright (C) 2020 BOSONIC, Inc. All rights reserved.
 * 
 * BOSONIC is a trademark of BOSONIC, Inc.
 * 
 * References to third-party marks or brands are the property of their
 * respective owners. No rights or licenses are granted, express or implied,
 * unless set forth in a written agreement signed by BOSONIC, Inc.
 * Dissemination or reproduction of content contained herein is strictly
 * forbidden except as otherwise expressly permitted pursuant to a
 * written agreement signed by BOSONIC, Inc.
 * 
 * Last Modified: 6/24/2024
 * Modified By: Victor Fattor
 * -----------------------
 * Last Modified: 6/24/2024
 * Modified By: Victor Fattor
 * 
 */
const QA = Object.freeze({
    BASE_URL_TRAD_1: 'https://trad1-qa.bosonicnetwork.com/',
    BASE_URL_TRAD_2: 'https://trad2-qa.bosonicnetwork.com/',
    BASE_URL_TRAD_3: 'https://trad3-qa.bosonicnetwork.com/',
    BASE_URL_TRAD_4: 'https://trad4-qa.bosonicnetwork.com/',
    BASE_URL_TRAD_5: 'https://trad5-qa.bosonicnetwork.com/',
    BASE_URL_TRAD_6: 'https://trad6-qa.bosonicnetwork.com/',
    BASE_URL_TRAD_7: 'https://trad7-qa.bosonicnetwork.com/',
    BASE_URL_TRAD_8: 'https://trad8-qa.bosonicnetwork.com/',
    BASE_URL_TRAD_CCNS1: 'https://ccns1-qa.bosonicnetwork.com/',
    BASE_URL_TRAD_CCNS2: 'https://ccns2-qa.bosonicnetwork.com/',
    BASE_URL_TRAD_SV_QA: 'https://vc-qa.bosonicnetwork.com/',
    BASE_URL_CUST_1: 'https://cust1-qa.bosonicnetwork.com/',
    BASE_URL_CUST_2: 'https://cust2-qa.bosonicnetwork.com/',
    BASE_URL_VIRTUAL_CUSTODIAN: 'https://virtual-custodian-qa.bosonicnetwork.com/',
    BASE_URL_CUST_DEMO_1: 'https://cust-demo1-qa.bosonicnetwork.com/',
    BASE_URL_CUST_DEMO_2: 'https://cust-demo2-qa.bosonicnetwork.com/',
    BASE_URL_CENTRAL: 'https://central-qa.bosonicnetwork.com/',
    BASE_URL_BOSONIC_PUBLIC_API: "https://api-qa.bosonicnetwork.com/",
    BASE_URL_SPREAD: "https://fees-qa.bosonicnetwork.com/",
    URL_WEB_SOCKET_CUST1: "wss://cust1-qa.bosonicnetwork.com/websocket/custodian",
    URL_WEB_SOCKET_CUST2: "wss://cust2-qa.bosonicnetwork.com/websocket/custodian",
    BASE_URL_JENKINS: "https://jenkins.bosonicdigital.net:8443/login",
    BASE_URL_JENKINS_CAPTURE_GENERATOR_JOB: "https://jenkins.bosonicdigital.net:8443/job/Devs/job/PostTrades-TradeCaptureGenerator/",
    USERS: {
        CENTRAL: {
            USER: 'central.automation@bosonic.digital',
            PASS: 'Demo1234$',
            APP: 'central',
            CODE: '0oaglten5qborExZb0h7',
            GROUP: 'User-Admin'
        },
        TM1: {
            USER: 'tm1.automation@bosonic.digital',
            PASS: 'Demo1234$',
            APP: 'tm1',
            CODE: '0oagluelmvff7S1cc0h7',
            ALIAS: 'TM01-TAUT',
            GROUP: 'User-Trader'
        },
        TM2: {
            USER: 'tm2.automation@bosonic.digital',
            PASS: 'Demo1234$',
            APP: 'tm2',
            CODE: '0oaglufdk4cjNESQ30h7',
            ALIAS: 'TM02-TAUT',
            GROUP: 'User-Trader'
        },
        TM3: {
            USER: 'tm3.qa-automation@bosonic.digital',
            PASS: 'Demo1234$',
            APP: 'tm3',
            CODE: 'NjhkOTA0YWY3YTRiZDQxNzkwMjM5ZDNk',
            ALIAS: 'TM03-TAUT',
            GROUP: 'User-Trader'
        },
        TM4: {
            USER: 'tm4.automation@bosonic.digital',
            PASS: 'Demo1234$',
            APP: 'tm4',
            CODE: '0oali41ml8YgAobZs0h7',
            ALIAS: 'TM04-TAUT',
            GROUP: 'User-Trader'
        },
        TM5: {
            USER: 'tm5.qa-automation@bosonic.digital',
            PASS: 'Demo1234$',
            APP: 'tm5',
            CODE: 'ZDRiNDVlNjdlYWYxZGY1NGNhMTZjNzcz',
            ALIAS: 'TM05-QAUT',
            GROUP: 'User-Trader'
        },
        TM2_POSITION_BY_ASSET: {
            USER: 'qa.trad2@bosonic.digital',
            PASS: 'Demo1234$',
            APP: 'tm2',
            CODE: '0oaglufdk4cjNESQ30h7',
            GROUP: 'User-Trader'
        },
        FEES: {
            USER: 'qa.fees@bosonic.digital',
            PASS: 'Demo1234',
            APP: 'fees',
            CODE: '0oagmp9gzbBeRTCvG0h7',
            GROUP: 'User-Trader'
        },
        REPO_FEES: {
            USER: 'fees@bosonic.digital',
            PASS: 'Demo1234$',
            APP: 'fees',
            CODE: '0oagmp9gzbBeRTCvG0h7',
            GROUP: 'User-Trader'
        },
        CUST1: {
            USER: 'cust1.automation@bosonic.digital',
            PASS: 'Demo1234$',
            APP: 'cust1',
            CODE: '0oaglxuno6qVcIrdU0h7',
            GROUP: 'User-Custodian'
        },
        CUST2: {
            USER: 'cust2.automation@bosonic.digital',
            PASS: 'Demo1234$',
            APP: 'cust2',
            CODE: '0oaglurkha6v0LcHu0h7',
            GROUP: 'User-Custodian'
        },
        CUST_DEMO1: {
            USER: 'qa_cust-demo1@bosonic.digital',
            PASS: 'Demo1234$',
            APP: 'custdemo1',
            CODE: 'MjUxMWM3YjRkMTYwNTlkMjU0MzNmMWIx',
            GROUP: 'User-Custodian',
            PRIVATE_KEY: '9c4c5a2d8263a47572b55c2ebc044f54d3114a2540d7b3a91b73006f5804a338',
            NETWORK_NAME: "sepolia"
        },
        CUST_DEMO2: {
            USER: 'qa_cust-demo2@bosonic.digital',
            PASS: 'Demo1234$',
            APP: 'custdemo2',
            CODE: 'MjUxMWM3YjRkMTYwNTlkMjU0MzNmMWIx',
            GROUP: 'User-Custodian',
            PRIVATE_KEY: '9c2885c8cb50c162bc893223f3787f95987fc3c73b01bc5d0c59b2b9aa996304',
            NETWORK_NAME: "sepolia"
        },
        CUST_VIRTUAL_CUSTODIAN: {
            USER: "qa.vc@bosonic.digital",
            PASS: "Demo1234$",
            APP: 'virtualcustodian',
            CODE: "YzcyOWYzOWYzZDk5NzVkOGRiNDM2MmJh",
            PRIVATE_KEY: 'b3ba70d2f57e3348818b38b5752fbf1f35f21e048b5f3701af937827b2964abe',
            NETWORK_NAME: "sepolia"
        },
        CUST_BRICK_AND_MORTAR_1: {
            USER: "qa.custdemo1@bosonic.digital",
            PASS: "Demo1234$",
            CODE: "N2NmZTBlNmQ0NjY1MjdhYjljZjZmZTM4",
        },
        CUST_BRICK_AND_MORTAR_2: {
            USER: "qa.custdemo2@bosonic.digital",
            PASS: "Demo1234$",
            CODE: "MjUxMWM3YjRkMTYwNTlkMjU0MzNmMWIx",
        },
        BROKER: {
            USER: 'central-broker.automation@bosonic.digital',
            PASS: 'Demo1234$',
            APP: 'central',
            CODE: '0oaglten5qborExZb0h7',
            GROUP: 'User-Broker'
        },
        TM2_2FA: {
            USER: 'tm2.automation-2fa_16@bosonic.digital',
            PASS: 'Demo1234$',
            APP: 'tm2',
            CODE: '0oaglufdk4cjNESQ30h7',
            ALIAS: 'TM02-TAU2',
            GROUP: 'User-Trader'
        },
        SPREAD: {
            USER: 'qa.spread@bosonic.digital',
            PASS: 'Demo1234$',
            APP: 'FEES',
            CODE: '0oagmp9gzbBeRTCvG0h7',
            ALIAS: 'FEES-QSPR',
            GROUP: 'User-Trader'
        },
        POSTTRADES_JENKINS: {
            USER: '',
            PASS: '',
            APP: 'Jenkins'
        },
        TM1_A_PAYMENT: {
            USER: 'payment_tm1.a@bosonic.digital',
            PASS: 'Demo1234$',
            APP: 'tm1',
            CODE: '0oagluelmvff7S1cc0h7',
            ALIAS: 'TM01-APA3',
            GROUP: 'User-Trader'
        },
        TM1_B_PAYMENT: {
            USER: 'payment_tm1.b@bosonic.digital',
            PASS: 'Demo1234$',
            APP: 'tm1',
            CODE: '0oagluelmvff7S1cc0h7',
            ALIAS: 'TM01-PAT1',
            GROUP: 'User-Trader'
        },
        TM1_C_PAYMENT: {
            USER: 'payment_tm1.c@bosonic.digital',
            PASS: 'Demo1234$',
            APP: 'tm1',
            CODE: '0oagluelmvff7S1cc0h7',
            ALIAS: 'TM01-PT11',
            GROUP: 'User-Trader'
        },
        TM3_A_PAYMENT: {
            USER: 'payment_tm3.a@bosonic.digital',
            PASS: 'Demo1234$',
            APP: 'tm3',
            CODE: 'NjhkOTA0YWY3YTRiZDQxNzkwMjM5ZDNk',
            ALIAS: 'TM03-PAT3',
            GROUP: 'User-Trader'
        },
        TM3_B_PAYMENT: {
            USER: 'payment_tm3.b@bosonic.digital',
            PASS: 'Demo1234$',
            APP: 'tm3',
            CODE: 'NjhkOTA0YWY3YTRiZDQxNzkwMjM5ZDNk',
            ALIAS: 'TM03-PT31',
            GROUP: 'User-Trader'
        },
        TM3_C_PAYMENT: {
            USER: 'payment_tm3.c@bosonic.digital',
            PASS: 'Demo1234$',
            APP: 'tm3',
            CODE: 'NjhkOTA0YWY3YTRiZDQxNzkwMjM5ZDNk',
            ALIAS: 'TM03-PT32',
            GROUP: 'User-Trader'
        },
        TM1_REPO: {
            USER: 'tm1.repo.automation@bosonic.digital',
            PASS: 'Demo1234$',
            APP: 'tm1',
            CODE: '0oagluelmvff7S1cc0h7',
            ALIAS: 'TM01-TREP',
            GROUP: 'User-Trader'
        },
        TM1_REPO_AUTO_CLOSE: {
            USER: 'tm1.repoautoclose.automation@bosonic.digital',
            PASS: 'Demo1234$',
            APP: 'tm1',
            CODE: '0oagluelmvff7S1cc0h7',
            ALIAS: 'TM01-TRE1',
            GROUP: 'User-Trader'
        },
        TM1_REPO_AUTO_LIQUIDATION: {
            USER: 'tm1.repoautoliquidation.automation@bosonic.digital',
            PASS: 'Demo1234$',
            APP: 'tm1',
            CODE: '0oagluelmvff7S1cc0h7',
            ALIAS: 'TM01-TRE2',
            GROUP: 'User-Trader'
        },
        TM1_REPO_24H: {
            USER: 'tm1.repo24H@bosonic.digital',
            PASS: 'Demo1234$',
            APP: 'tm1',
            CODE: '0oagluelmvff7S1cc0h7',
            GROUP: 'User-Trader'
        },
        TM3_REPO_24H: {
            USER: 'tm3.repo24H@bosonic.digital',
            PASS: 'Demo1234$',
            APP: 'tm3',
            CODE: 'NjhkOTA0YWY3YTRiZDQxNzkwMjM5ZDNk',
            GROUP: 'User-Trader'
        },
        TM1_REPO_01A: {
            USER: 'tm1.repoaut.01a@bosonic.digital',
            PASS: 'Demo1234$',
            APP: 'tm1',
            CODE: '0oagluelmvff7S1cc0h7',
            ALIAS: 'TM01-T013',
            GROUP: 'User-Trader'
        },
        TM3_REPO_01A: {
            USER: 'tm3.repoaut.01a@bosonic.digital',
            PASS: 'Demo1234$',
            APP: 'tm3',
            CODE: 'NjhkOTA0YWY3YTRiZDQxNzkwMjM5ZDNk',
            ALIAS: 'TM03-T01A',
            GROUP: 'User-Trader'
        },
        TM1_REPO_01B: {
            USER: 'tm1.repoaut.01b@bosonic.digital',
            PASS: 'Demo1234$',
            APP: 'tm1',
            CODE: '0oagluelmvff7S1cc0h7',
            ALIAS: 'TM01-T01B',
            GROUP: 'User-Trader'
        },
        TM3_REPO_01B: {
            USER: 'tm3.repoaut.01b@bosonic.digital',
            PASS: 'Demo1234$',
            APP: 'tm3',
            CODE: 'NjhkOTA0YWY3YTRiZDQxNzkwMjM5ZDNk',
            ALIAS: 'TM03-T01B',
            GROUP: 'User-Trader'
        },
        TM1_REPO_01C: {
            USER: 'tm1.repoaut.01c@bosonic.digital',
            PASS: 'Demo1234$',
            APP: 'tm1',
            CODE: '0oagluelmvff7S1cc0h7',
            ALIAS: 'TM01-T01C',
            GROUP: 'User-Trader'
        },
        TM3_REPO_01C: {
            USER: 'tm3.repoaut.01c@bosonic.digital',
            PASS: 'Demo1234$',
            APP: 'tm3',
            CODE: 'NjhkOTA0YWY3YTRiZDQxNzkwMjM5ZDNk',
            ALIAS: 'TM03-T01C',
            GROUP: 'User-Trader'
        },
        TM1_REPO_01D: {
            USER: 'tm1.repoaut.01d@bosonic.digital',
            PASS: 'Demo1234$',
            APP: 'tm1',
            CODE: '0oagluelmvff7S1cc0h7',
            ALIAS: 'TM01-T01D',
            GROUP: 'User-Trader'
        },
        TM3_REPO_01D: {
            USER: 'tm3.repoaut.01d@bosonic.digital',
            PASS: 'Demo1234$',
            APP: 'tm3',
            CODE: 'NjhkOTA0YWY3YTRiZDQxNzkwMjM5ZDNk',
            ALIAS: 'TM03-T01D',
            GROUP: 'User-Trader'
        },
        TM1_REPO_02A: {
            USER: 'tm1.repoaut.02a@bosonic.digital',
            PASS: 'Demo1234$',
            APP: 'tm1',
            CODE: '0oagluelmvff7S1cc0h7',
            ALIAS: 'TM01-T02A',
            GROUP: 'User-Trader'
        },
        TM3_REPO_02A: {
            USER: 'tm3.repoaut.02a@bosonic.digital',
            PASS: 'Demo1234$',
            APP: 'tm3',
            CODE: 'NjhkOTA0YWY3YTRiZDQxNzkwMjM5ZDNk',
            ALIAS: 'TM03-T02A',
            GROUP: 'User-Trader'
        },
        TM1_REPO_02B: {
            USER: 'tm1.repoaut.02b@bosonic.digital',
            PASS: 'Demo1234$',
            APP: 'tm1',
            CODE: '0oagluelmvff7S1cc0h7',
            ALIAS: 'TM01-T02B',
            GROUP: 'User-Trader'
        },
        TM3_REPO_02B: {
            USER: 'tm3.repoaut.02b@bosonic.digital',
            PASS: 'Demo1234$',
            APP: 'tm3',
            CODE: 'NjhkOTA0YWY3YTRiZDQxNzkwMjM5ZDNk',
            ALIAS: 'TM03-T02B',
            GROUP: 'User-Trader'
        },
        TM1_REPO_02C: {
            USER: 'tm1.repoaut.02c@bosonic.digital',
            PASS: 'Demo1234$',
            APP: 'tm1',
            CODE: '0oagluelmvff7S1cc0h7',
            ALIAS: 'TM01-T02C',
            GROUP: 'User-Trader'
        },
        TM3_REPO_02C: {
            USER: 'tm3.repoaut.02c@bosonic.digital',
            PASS: 'Demo1234$',
            APP: 'tm3',
            CODE: 'NjhkOTA0YWY3YTRiZDQxNzkwMjM5ZDNk',
            ALIAS: 'TM03-T02C',
            GROUP: 'User-Trader'
        },
        TM1_REPO_02D: {
            USER: 'tm1.repoaut.02d@bosonic.digital',
            PASS: 'Demo1234$',
            APP: 'tm1',
            CODE: '0oagluelmvff7S1cc0h7',
            ALIAS: 'TM01-T02D',
            GROUP: 'User-Trader'
        },
        TM3_REPO_02D: {
            USER: 'tm3.repoaut.02d@bosonic.digital',
            PASS: 'Demo1234$',
            APP: 'tm3',
            CODE: 'NjhkOTA0YWY3YTRiZDQxNzkwMjM5ZDNk',
            ALIAS: 'TM03-T02D',
            GROUP: 'User-Trader'
        },
        TM1_REPO_03A: {
            USER: 'tm1.repoaut.03a@bosonic.digital',
            PASS: 'Demo1234$',
            APP: 'tm1',
            CODE: '0oagluelmvff7S1cc0h7',
            ALIAS: 'TM01-T03A',
            GROUP: 'User-Trader'
        },
        TM3_REPO_03A: {
            USER: 'tm3.repoaut.03a@bosonic.digital',
            PASS: 'Demo1234$',
            APP: 'tm3',
            CODE: 'NjhkOTA0YWY3YTRiZDQxNzkwMjM5ZDNk',
            ALIAS: 'TM03-T03A',
            GROUP: 'User-Trader'
        },
        TM1_REPO_03B: {
            USER: 'tm1.repoaut.03b@bosonic.digital',
            PASS: 'Demo1234$',
            APP: 'tm1',
            CODE: '0oagluelmvff7S1cc0h7',
            ALIAS: 'TM01-T03B',
            GROUP: 'User-Trader'
        },
        TM3_REPO_03B: {
            USER: 'tm3.repoaut.03b@bosonic.digital',
            PASS: 'Demo1234$',
            APP: 'tm3',
            CODE: 'NjhkOTA0YWY3YTRiZDQxNzkwMjM5ZDNk',
            ALIAS: 'TM03-T03B',
            GROUP: 'User-Trader'
        },
        TM1_REPO_03C: {
            USER: 'tm1.repoaut.03c@bosonic.digital',
            PASS: 'Demo1234$',
            APP: 'tm1',
            CODE: '0oagluelmvff7S1cc0h7',
            ALIAS: 'TM01-T03C',
            GROUP: 'User-Trader'
        },
        TM3_REPO_03C: {
            USER: 'tm3.repoaut.03c@bosonic.digital',
            PASS: 'Demo1234$',
            APP: 'tm3',
            CODE: 'NjhkOTA0YWY3YTRiZDQxNzkwMjM5ZDNk',
            ALIAS: 'TM03-T03C',
            GROUP: 'User-Trader'
        },
        TM1_REPO_03D: {
            USER: 'tm1.repoaut.03d@bosonic.digital',
            PASS: 'Demo1234$',
            APP: 'tm1',
            CODE: '0oagluelmvff7S1cc0h7',
            ALIAS: 'TM01-T03D',
            GROUP: 'User-Trader'
        },
        TM3_REPO_03D: {
            USER: 'tm3.repoaut.03d@bosonic.digital',
            PASS: 'Demo1234$',
            APP: 'tm3',
            CODE: 'NjhkOTA0YWY3YTRiZDQxNzkwMjM5ZDNk',
            ALIAS: 'TM03-T03D',
            GROUP: 'User-Trader'
        },
        TM1_REPO_04A: {
            USER: 'tm1.repoaut.04a@bosonic.digital',
            PASS: 'Demo1234$',
            APP: 'tm1',
            CODE: '0oagluelmvff7S1cc0h7',
            ALIAS: 'TM01-T04A',
            GROUP: 'User-Trader'
        },
        TM3_REPO_04A: {
            USER: 'tm3.repoaut.04a@bosonic.digital',
            PASS: 'Demo1234$',
            APP: 'tm3',
            CODE: 'NjhkOTA0YWY3YTRiZDQxNzkwMjM5ZDNk',
            ALIAS: 'TM03-T04A',
            GROUP: 'User-Trader'
        },
        TM1_REPO_04B: {
            USER: 'tm1.repoaut.04b@bosonic.digital',
            PASS: 'Demo1234$',
            APP: 'tm1',
            CODE: '0oagluelmvff7S1cc0h7',
            ALIAS: 'TM01-T04B',
            GROUP: 'User-Trader'
        },
        TM3_REPO_04B: {
            USER: 'tm3.repoaut.04b@bosonic.digital',
            PASS: 'Demo1234$',
            APP: 'tm3',
            CODE: 'NjhkOTA0YWY3YTRiZDQxNzkwMjM5ZDNk',
            ALIAS: 'TM03-T04B',
            GROUP: 'User-Trader'
        },
        TM1_REPO_04C: {
            USER: 'tm1.repoaut.04c@bosonic.digital',
            PASS: 'Demo1234$',
            APP: 'tm1',
            CODE: '0oagluelmvff7S1cc0h7',
            ALIAS: 'TM01-T04C',
            GROUP: 'User-Trader'
        },
        TM3_REPO_04C: {
            USER: 'tm3.repoaut.04c@bosonic.digital',
            PASS: 'Demo1234$',
            APP: 'tm3',
            CODE: 'NjhkOTA0YWY3YTRiZDQxNzkwMjM5ZDNk',
            ALIAS: 'TM03-T04C',
            GROUP: 'User-Trader'
        },
        TM1_REPO_04D: {
            USER: 'tm1.repoaut.04d@bosonic.digital',
            PASS: 'Demo1234$',
            APP: 'tm1',
            CODE: '0oagluelmvff7S1cc0h7',
            ALIAS: 'TM01-T04D',
            GROUP: 'User-Trader'
        },
        TM3_REPO_04D: {
            USER: 'tm3.repoaut.04d@bosonic.digital',
            PASS: 'Demo1234$',
            APP: 'tm3',
            CODE: 'NjhkOTA0YWY3YTRiZDQxNzkwMjM5ZDNk',
            ALIAS: 'TM03-T04D',
            GROUP: 'User-Trader'
        },
        TM1_REPO_05B: {
            USER: 'tm1.repoaut.05b@bosonic.digital',
            PASS: 'Demo1234$',
            APP: 'tm1',
            CODE: '0oagluelmvff7S1cc0h7',
            ALIAS: 'TM01-T05B',
            GROUP: 'User-Trader'
        },
        TM3_REPO_05B: {
            USER: 'tm3.repoaut.05b@bosonic.digital',
            PASS: 'Demo1234$',
            APP: 'tm3',
            CODE: 'NjhkOTA0YWY3YTRiZDQxNzkwMjM5ZDNk',
            ALIAS: 'TM03-T05B',
            GROUP: 'User-Trader'
        },
        TM1_REPO_05C: {
            USER: 'tm1.repoaut.05c@bosonic.digital',
            PASS: 'Demo1234$',
            APP: 'tm1',
            CODE: '0oagluelmvff7S1cc0h7',
            ALIAS: 'TM01-T05C',
            GROUP: 'User-Trader'
        },
        TM3_REPO_05C: {
            USER: 'tm3.repoaut.05c@bosonic.digital',
            PASS: 'Demo1234$',
            APP: 'tm3',
            CODE: 'NjhkOTA0YWY3YTRiZDQxNzkwMjM5ZDNk',
            ALIAS: 'TM03-T05C',
            GROUP: 'User-Trader'
        },
        TM1_REPO_05D: {
            USER: 'tm1.repoaut.05d@bosonic.digital',
            PASS: 'Demo1234$',
            APP: 'tm1',
            CODE: '0oagluelmvff7S1cc0h7',
            ALIAS: 'TM01-T05D',
            GROUP: 'User-Trader'
        },
        TM3_REPO_05D: {
            USER: 'tm3.repoaut.05d@bosonic.digital',
            PASS: 'Demo1234$',
            APP: 'tm3',
            CODE: 'NjhkOTA0YWY3YTRiZDQxNzkwMjM5ZDNk',
            ALIAS: 'TM03-T05D',
            GROUP: 'User-Trader'
        },
        TM1_REPO_06B: {
            USER: 'tm1.repoaut.06b@bosonic.digital',
            PASS: 'Demo1234$',
            APP: 'tm1',
            CODE: '0oagluelmvff7S1cc0h7',
            ALIAS: 'TM01-T06B',
            GROUP: 'User-Trader'
        },
        TM3_REPO_06B: {
            USER: 'tm3.repoaut.06b@bosonic.digital',
            PASS: 'Demo1234$',
            APP: 'tm3',
            CODE: 'NjhkOTA0YWY3YTRiZDQxNzkwMjM5ZDNk',
            ALIAS: 'TM03-T06B',
            GROUP: 'User-Trader'
        },
        TM1_REPO_06C: {
            USER: 'tm1.repoaut.06c@bosonic.digital',
            PASS: 'Demo1234$',
            APP: 'tm1',
            CODE: '0oagluelmvff7S1cc0h7',
            ALIAS: 'TM01-T06C',
            GROUP: 'User-Trader'
        },
        TM3_REPO_06C: {
            USER: 'tm3.repoaut.06c@bosonic.digital',
            PASS: 'Demo1234$',
            APP: 'tm3',
            CODE: 'NjhkOTA0YWY3YTRiZDQxNzkwMjM5ZDNk',
            ALIAS: 'TM03-T06C',
            GROUP: 'User-Trader'
        },
        TM1_REPO_06D: {
            USER: 'tm1.repoaut.06d@bosonic.digital',
            PASS: 'Demo1234$',
            APP: 'tm1',
            CODE: '0oagluelmvff7S1cc0h7',
            ALIAS: 'TM01-T06D',
            GROUP: 'User-Trader'
        },
        TM3_REPO_06D: {
            USER: 'tm3.repoaut.06d@bosonic.digital',
            PASS: 'Demo1234$',
            APP: 'tm3',
            CODE: 'NjhkOTA0YWY3YTRiZDQxNzkwMjM5ZDNk',
            ALIAS: 'TM03-T06D',
            GROUP: 'User-Trader'
        },
        TM1_REPO_07B: {
            USER: 'tm1.repoaut.07b@bosonic.digital',
            PASS: 'Demo1234$',
            APP: 'tm1',
            CODE: '0oagluelmvff7S1cc0h7',
            ALIAS: 'TM01-T07B',
            GROUP: 'User-Trader'
        },
        TM3_REPO_07B: {
            USER: 'tm3.repoaut.07b@bosonic.digital',
            PASS: 'Demo1234$',
            APP: 'tm3',
            CODE: 'NjhkOTA0YWY3YTRiZDQxNzkwMjM5ZDNk',
            ALIAS: 'TM03-T07B',
            GROUP: 'User-Trader'
        },
        TM1_REPO_07C: {
            USER: 'tm1.repoaut.07c@bosonic.digital',
            PASS: 'Demo1234$',
            APP: 'tm1',
            CODE: '0oagluelmvff7S1cc0h7',
            ALIAS: 'TM01-T07C',
            GROUP: 'User-Trader'
        },
        TM3_REPO_07C: {
            USER: 'tm3.repoaut.07c@bosonic.digital',
            PASS: 'Demo1234$',
            APP: 'tm3',
            CODE: 'NjhkOTA0YWY3YTRiZDQxNzkwMjM5ZDNk',
            ALIAS: 'TM03-T07C',
            GROUP: 'User-Trader'
        },
        TM1_REPO_07D: {
            USER: 'tm1.repoaut.07d@bosonic.digital',
            PASS: 'Demo1234$',
            APP: 'tm1',
            CODE: '0oagluelmvff7S1cc0h7',
            ALIAS: 'TM01-T07D',
            GROUP: 'User-Trader'
        },
        TM3_REPO_07D: {
            USER: 'tm3.repoaut.07d@bosonic.digital',
            PASS: 'Demo1234$',
            APP: 'tm3',
            CODE: 'NjhkOTA0YWY3YTRiZDQxNzkwMjM5ZDNk',
            ALIAS: 'TM03-T07D',
            GROUP: 'User-Trader'
        },
        TM1_REPO_08B: {
            USER: 'tm1.repoaut.08b@bosonic.digital',
            PASS: 'Demo1234$',
            APP: 'tm1',
            CODE: '0oagluelmvff7S1cc0h7',
            ALIAS: 'TM01-T08B',
            GROUP: 'User-Trader'
        },
        TM3_REPO_08B: {
            USER: 'tm3.repoaut.08b@bosonic.digital',
            PASS: 'Demo1234$',
            APP: 'tm3',
            CODE: 'NjhkOTA0YWY3YTRiZDQxNzkwMjM5ZDNk',
            ALIAS: 'TM03-T08B',
            GROUP: 'User-Trader'
        },
        TM1_REPO_09B: {
            USER: 'tm1.repoaut.09b@bosonic.digital',
            PASS: 'Demo1234$',
            APP: 'tm1',
            CODE: '0oagluelmvff7S1cc0h7',
            ALIAS: 'TM01-T09B',
            GROUP: 'User-Trader'
        },
        TM3_REPO_09B: {
            USER: 'tm3.repoaut.09b@bosonic.digital',
            PASS: 'Demo1234$',
            APP: 'tm3',
            CODE: 'NjhkOTA0YWY3YTRiZDQxNzkwMjM5ZDNk',
            ALIAS: 'TM03-T09B',
            GROUP: 'User-Trader'
        },
        TM1_REPO_10B: {
            USER: 'tm1.repoaut.10b@bosonic.digital',
            PASS: 'Demo1234$',
            APP: 'tm1',
            CODE: '0oagluelmvff7S1cc0h7',
            ALIAS: 'TM01-T10B',
            GROUP: 'User-Trader'
        },
        TM3_REPO_10B: {
            USER: 'tm3.repoaut.10b@bosonic.digital',
            PASS: 'Demo1234$',
            APP: 'tm3',
            CODE: 'NjhkOTA0YWY3YTRiZDQxNzkwMjM5ZDNk',
            ALIAS: 'TM03-T10B',
            GROUP: 'User-Trader'
        },
        TM1_REPO_10C: {
            USER: 'tm1.repoaut.10c@bosonic.digital',
            PASS: 'Demo1234$',
            APP: 'tm1',
            CODE: '0oagluelmvff7S1cc0h7',
            ALIAS: 'TM01-T10C',
            GROUP: 'User-Trader'
        },
        TM3_REPO_10C: {
            USER: 'tm3.repoaut.10c@bosonic.digital',
            PASS: 'Demo1234$',
            APP: 'tm3',
            CODE: 'NjhkOTA0YWY3YTRiZDQxNzkwMjM5ZDNk',
            ALIAS: 'TM03-T10C',
            GROUP: 'User-Trader'
        },
        TM1_REPO_10D: {
            USER: 'tm1.repoaut.10d@bosonic.digital',
            PASS: 'Demo1234$',
            APP: 'tm1',
            CODE: '0oagluelmvff7S1cc0h7',
            ALIAS: 'TM01-T10D',
            GROUP: 'User-Trader'
        },
        TM3_REPO_10D: {
            USER: 'tm3.repoaut.10d@bosonic.digital',
            PASS: 'Demo1234$',
            APP: 'tm3',
            CODE: 'NjhkOTA0YWY3YTRiZDQxNzkwMjM5ZDNk',
            ALIAS: 'TM03-T10D',
            GROUP: 'User-Trader'
        },
        TM1_REPO_11B: {
            USER: 'tm1.repoaut.11b@bosonic.digital',
            PASS: 'Demo1234$',
            APP: 'tm1',
            CODE: '0oagluelmvff7S1cc0h7',
            ALIAS: 'TM01-T11B',
            GROUP: 'User-Trader'
        },
        TM3_REPO_11B: {
            USER: 'tm3.repoaut.11b@bosonic.digital',
            PASS: 'Demo1234$',
            APP: 'tm3',
            CODE: 'NjhkOTA0YWY3YTRiZDQxNzkwMjM5ZDNk',
            ALIAS: 'TM03-T11B',
            GROUP: 'User-Trader'
        },
        TM1_REPO_13: {
            USER: 'tm1.repoaut.13@bosonic.digital',
            PASS: 'Demo1234$',
            APP: 'tm1',
            CODE: '0oagluelmvff7S1cc0h7',
            ALIAS: 'TM01-TM13',
            GROUP: 'User-Trader'
        },
        TM3_REPO_13: {
            USER: 'tm3.repoaut.13@bosonic.digital',
            PASS: 'Demo1234$',
            APP: 'tm3',
            CODE: 'NjhkOTA0YWY3YTRiZDQxNzkwMjM5ZDNk',
            ALIAS: 'TM03-TM13',
            GROUP: 'User-Trader'
        },
        TM1_REPO_14: {
            USER: 'tm1.repoaut.14@bosonic.digital',
            PASS: 'Demo1234$',
            APP: 'tm1',
            CODE: '0oagluelmvff7S1cc0h7',
            ALIAS: 'TM01-TM14',
            GROUP: 'User-Trader'
        },
        TM3_REPO_14: {
            USER: 'tm3.repoaut.14@bosonic.digital',
            PASS: 'Demo1234$',
            APP: 'tm3',
            CODE: 'NjhkOTA0YWY3YTRiZDQxNzkwMjM5ZDNk',
            ALIAS: 'TM03-TM14',
            GROUP: 'User-Trader'
        },
        TM1_REPO_15: {
            USER: 'tm1.repoaut.15@bosonic.digital',
            PASS: 'Demo1234$',
            APP: 'tm1',
            CODE: '0oagluelmvff7S1cc0h7',
            ALIAS: 'TM01-TM15',
            GROUP: 'User-Trader'
        },
        TM3_REPO_15: {
            USER: 'tm3.repoaut.15@bosonic.digital',
            PASS: 'Demo1234$',
            APP: 'tm3',
            CODE: 'NjhkOTA0YWY3YTRiZDQxNzkwMjM5ZDNk',
            ALIAS: 'TM03-TM15',
            GROUP: 'User-Trader'
        },
        TM1_REPO_16: {
            USER: 'tm1.repoaut.16@bosonic.digital',
            PASS: 'Demo1234$',
            APP: 'tm1',
            CODE: '0oagluelmvff7S1cc0h7',
            ALIAS: 'TM01-TM16',
            GROUP: 'User-Trader'
        },
        TM3_REPO_16: {
            USER: 'tm3.repoaut.16@bosonic.digital',
            PASS: 'Demo1234$',
            APP: 'tm3',
            CODE: 'NjhkOTA0YWY3YTRiZDQxNzkwMjM5ZDNk',
            ALIAS: 'TM03-TM16',
            GROUP: 'User-Trader'
        },
        TM1_REPO_17: {
            USER: 'tm1.repoaut.17@bosonic.digital',
            PASS: 'Demo1234$',
            APP: 'tm1',
            CODE: '0oagluelmvff7S1cc0h7',
            ALIAS: 'TM01-TM17',
            GROUP: 'User-Trader'
        },
        TM3_REPO_17: {
            USER: 'tm3.repoaut.17@bosonic.digital',
            PASS: 'Demo1234$',
            APP: 'tm3',
            CODE: 'NjhkOTA0YWY3YTRiZDQxNzkwMjM5ZDNk',
            ALIAS: 'TM03-TM17',
            GROUP: 'User-Trader'
        },
        TM1_REPO_18: {
            USER: 'tm1.repoaut.18@bosonic.digital',
            PASS: 'Demo1234$',
            APP: 'tm1',
            CODE: '0oagluelmvff7S1cc0h7',
            ALIAS: 'TM01-TM18',
            GROUP: 'User-Trader'
        },
        TM3_REPO_18: {
            USER: 'tm3.repoaut.18@bosonic.digital',
            PASS: 'Demo1234$',
            APP: 'tm3',
            CODE: 'NjhkOTA0YWY3YTRiZDQxNzkwMjM5ZDNk',
            ALIAS: 'TM03-TM18',
            GROUP: 'User-Trader'
        },
        TM1_REPO_19: {
            USER: 'tm1.repoaut.19@bosonic.digital',
            PASS: 'Demo1234$',
            APP: 'tm1',
            CODE: '0oagluelmvff7S1cc0h7',
            ALIAS: 'TM01-TM19',
            GROUP: 'User-Trader'
        },
        TM3_REPO_19: {
            USER: 'tm3.repoaut.19@bosonic.digital',
            PASS: 'Demo1234$',
            APP: 'tm3',
            CODE: 'NjhkOTA0YWY3YTRiZDQxNzkwMjM5ZDNk',
            ALIAS: 'TM03-TM19',
            GROUP: 'User-Trader'
        },
        TM1_REPO_20: {
            USER: 'tm1.repoaut.20@bosonic.digital',
            PASS: 'Demo1234$',
            APP: 'tm1',
            CODE: '0oagluelmvff7S1cc0h7',
            ALIAS: 'TM01-TM20',
            GROUP: 'User-Trader'
        },
        TM3_REPO_20: {
            USER: 'tm3.repoaut.20@bosonic.digital',
            PASS: 'Demo1234$',
            APP: 'tm3',
            CODE: 'NjhkOTA0YWY3YTRiZDQxNzkwMjM5ZDNk',
            ALIAS: 'TM03-TM20',
            GROUP: 'User-Trader'
        },
        TM1_REPO_21: {
            USER: 'tm1.repoaut.21@bosonic.digital',
            PASS: 'Demo1234$',
            APP: 'tm1',
            CODE: '0oagluelmvff7S1cc0h7',
            ALIAS: 'TM01-TM21',
            GROUP: 'User-Trader'
        },
        TM3_REPO_21: {
            USER: 'tm3.repoaut.21@bosonic.digital',
            PASS: 'Demo1234$',
            APP: 'tm3',
            CODE: 'NjhkOTA0YWY3YTRiZDQxNzkwMjM5ZDNk',
            ALIAS: 'TM03-TM21',
            GROUP: 'User-Trader'
        },
        TM1_REPO_22: {
            USER: 'tm1.repoaut.22@bosonic.digital',
            PASS: 'Demo1234$',
            APP: 'tm1',
            CODE: '0oagluelmvff7S1cc0h7',
            ALIAS: 'TM01-TM22',
            GROUP: 'User-Trader'
        },
        TM3_REPO_22: {
            USER: 'tm3.repoaut.22@bosonic.digital',
            PASS: 'Demo1234$',
            APP: 'tm3',
            CODE: 'NjhkOTA0YWY3YTRiZDQxNzkwMjM5ZDNk',
            ALIAS: 'TM03-TM22',
            GROUP: 'User-Trader'
        },
        TM1_REPO_23: {
            USER: 'tm1.repoaut.23@bosonic.digital',
            PASS: 'Demo1234$',
            APP: 'tm1',
            CODE: '0oagluelmvff7S1cc0h7',
            ALIAS: 'TM01-TM23',
            GROUP: 'User-Trader'
        },
        TM3_REPO_23: {
            USER: 'tm3.repoaut.23@bosonic.digital',
            PASS: 'Demo1234$',
            APP: 'tm3',
            CODE: 'NjhkOTA0YWY3YTRiZDQxNzkwMjM5ZDNk',
            ALIAS: 'TM03-TM23',
            GROUP: 'User-Trader'
        },
        TM3_REPO: {
            USER: 'tm3.repo.automation@bosonic.digital',
            PASS: 'Demo1234$',
            APP: 'tm3',
            CODE: 'NjhkOTA0YWY3YTRiZDQxNzkwMjM5ZDNk',
            ALIAS: 'TM03-TREP',
            GROUP: 'User-Trader'
        },
        TM1_REPO2: {
            USER: 'repo_qa.automation_tm1@bosonic.digital',
            PASS: 'Demo1234$',
            APP: 'tm1',
            CODE: '0oagluelmvff7S1cc0h7',
            ALIAS: 'TM01-RAUT',
            GROUP: 'User-Trader'
        },
        TM3_REPO2: {
            USER: 'repo_qa.automation_tm3@bosonic.digital',
            PASS: 'Demo1234$',
            APP: 'tm3',
            CODE: 'NjhkOTA0YWY3YTRiZDQxNzkwMjM5ZDNk',
            ALIAS: 'TM03-RAUT',
            GROUP: 'User-Trader'
        },
        TM1_POSTTRADE_WITHOUT_BALANCE: {
            USER: 'qa.tm1.automation.110@bosonic.digital',
            PASS: 'Demo1234$',
            APP: 'tm1',
            CODE: '0oagluelmvff7S1cc0h7',
            ALIAS: 'TM01-TSOC',
            GROUP: 'User-Trader'
        },
        TM6_CCNS_BM: {
            USER: "ccns.tm6.qa-automation@bosonic.digital",
            PASS: "Demo1234$",
            APP: "tm6",
            CODE: "TM6iNDVlNjdlYWYxZGY1NGNhMTZjN24z",
            ALIAS: "TM06-AUSE",
        },
        TM8_CCNS: {
            USER: 'ccns.tm8.qa-automation@bosonic.digital',
            PASS: 'Demo1234$',
            APP: 'tm8',
            CODE: 'ODIyYTRiZmI4MzQzZTc4YzY3MzA2ZGQx',
            ALIAS: 'TRAD-CAUT',
        },
        TM_CCNS2: {
            USER: 'ccns.tmccns2.qa-automation@bosonic.digital',
            PASS: 'Demo1234$',
            APP: 'CCNS2',
            CODE: 'YzkwODZiODUxN2E1MmJkNzBkMjBlY2Rj',
            ALIAS: 'TRAD-CAU1'
        },
        TM_CCNS1: {
            USER: 'ccns.tmccns1.qa-automation@bosonic.digital',
            PASS: 'Demo1234$',
            APP: 'CCNS1',
            CODE: 'MWI0MzdkNjUzMmQwMmFkMDI4MTI0MjJh',
            ALIAS: 'TRADER_CCNS1',
            PRIVATE_KEY: '5d40d44bbc83ac75bd84624691d0179512c381cc1b2430691426687331fd7496',
            NETWORK_NAME: "sepolia"
        },
        TM_CCNS2_BM: {
            USER: 'ccns.tmccns2.qa-automation@bosonic.digital',
            PASS: 'Demo1234$',
            APP: 'CCNS2',
            CODE: 'YzkwODZiODUxN2E1MmJkNzBkMjBlY2Rj',
            ALIAS: 'TRAD-CAU1'
        },
        TM_SV_QA: {
            USER: 'qa_sv_automation@bosonic.digital',
            PASS: 'Demo1234$',
            APP: 'VC-QA',
            CODE: 'YTZiNGQyYzUzNzJjNTViOThhOTg4ODhm',
            ALIAS: 'TRADER_VC',
            PRIVATE_KEY: 'faa0649c122d1c90ea31213ef1305c83c9a7c7414e14cc39ea41793f43e51f14',
            NETWORK_NAME: "sepolia"
        }
    }
})

const IT = Object.freeze({

    BASE_URL_TRAD_1: 'https://trad1.itserver.otcxn.io/',
    BASE_URL_TRAD_2: 'https://trad2.itserver.otcxn.io/',
    BASE_URL_TRAD_4: 'https://trad4.itserver.otcxn.io/',
    BASE_URL_TRAD_5: 'https://trad5.itserver.otcxn.io/',
    BASE_URL_TRAD_6: 'https://trad6.itserver.otcxn.io/',
    BASE_URL_TRAD_7: 'https://trad7.itserver.otcxn.io/',
    BASE_URL_CUST_1: 'https://cust1.itserver.otcxn.io/',
    BASE_URL_CUST_2: 'https://cust2.itserver.otcxn.io/',
    BASE_URL_CENTRAL: 'https://central.itserver.otcxn.io/',
    USERS: {
        CENTRAL: {
            USER: 'central.automation@bosonic.digital',
            PASS: 'Demo1234$',
            APP: 'central',
            CODE: '0oaglten5qborExZb0h7',
            GROUP: 'User-Admin'
        },
        TM1: {
            USER: 'tm1.automation@bosonic.digital',
            PASS: 'Demo1234$',
            APP: 'tm1',
            CODE: '0oagluelmvff7S1cc0h7',
            ALIAS: 'TM01-TAUT',
            GROUP: 'User-Trader'
        },
        TM2: {
            USER: 'tm2.automation@bosonic.digital',
            PASS: 'Demo1234$',
            APP: 'tm2',
            CODE: '0oaglufdk4cjNESQ30h7',
            ALIAS: 'TM02-TAUT',
            GROUP: 'User-Trader'
        },
        TM4: {
            USER: 'tm4.automation@bosonic.digital',
            PASS: 'Demo1234$',
            APP: 'tm4',
            CODE: '0oagmp9ymbElenCvG0h7',
            ALIAS: 'TM04-TAU1',
            GROUP: 'User-Trader'
        },
        FEES: {
            USER: 'qa.fees@bosonic.digital',
            PASS: 'Demo1234',
            APP: 'fees',
            CODE: '0oagmp9gzbBeRTCvG0h7',
            GROUP: 'User-Trader'
        },
        CUST1: {
            USER: 'cust1.automation@bosonic.digital',
            PASS: 'Demo1234$',
            APP: 'cust1',
            CODE: '0oaglxuno6qVcIrdU0h7',
            GROUP: 'User-Custodian'
        },
        CUST2: {
            USER: 'cust2.automation@bosonic.digital',
            PASS: 'Demo1234$',
            APP: 'cust2',
            CODE: '0oaglurkha6v0LcHu0h7',
            GROUP: 'User-Custodian'
        },
        BROKER: {
            USER: 'central-broker.automation@bosonic.digital',
            PASS: 'Demo1234$',
            APP: 'central',
            CODE: '0oaglten5qborExZb0h7',
            GROUP: 'User-Broker'
        }
    }

})

function switchEnvironment(env) {

    switch (env) {
        case 'it':
            return IT
        case 'qa':
            return QA
        default:
            return null
    }

}

module.exports = switchEnvironment(Cypress.env('target'))