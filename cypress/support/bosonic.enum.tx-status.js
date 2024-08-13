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
 * Date: 06/16/23 
 * Author(s): Victor Fattor
 * -----
 * Last Modified: 01/12/2024
 * Modified By: Diego Graf
 * -----
 * 
 */

module.exports = Object.freeze({

    STATUS: {
        PENDING: 'PENDING',
        CANCELLED: 'CANCELLED',
        SETTLED: 'SETTLED',
        ACCEPTED: 'ACCEPTED',
        COMPLETED: 'COMPLETED',
        APPROVED: 'APPROVED',
        PARTFILL_CONFIRMED: 'PARTFILL-CONFIRMED',
        PARTFILL: 'PARTFILL',
        REJECTED: 'REJECTED',
        ENABLED: 'ENABLED',
        DISABLED: 'DISABLED',
        REPAID: 'REPAID',
        DEFAULT: 'DEFAULT',
        SETTLEMENT_COMPLETE: 'SETTLEMENT COMPLETE',
        CREATED: 'CREATED',
        EXECUTED: 'EXECUTED',
        REQUESTED: 'REQUESTED'
    },

})