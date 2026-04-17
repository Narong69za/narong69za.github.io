/**
 * =====================================================
 * PROJECT: SN DESIGN STUDIO
 * MODULE: services/license.service.js
 * VERSION: 1.0.0
 * STATUS: ACTIVE
 * LAST FIX: Memory license engine for testing
 * =====================================================
 */

const crypto = require("crypto");

const licenses = {};

/**
 * Generate FREE key
 */
exports.createFreeKey = async () => {

    const key = "FREE-" + crypto.randomBytes(3).toString("hex");

    licenses[key] = {

        tier: "FREE",

        status: "new",

        device_id: null,

        expire_at: null

    };

    return key;

};


/**
 * Activate key
 */
exports.activateKey = async (key, device_id) => {

    const license = licenses[key];

    if (!license) {

        return {
            success: false,
            message: "invalid_key"
        };

    }

    if (license.device_id && license.device_id !== device_id) {

        return {
            success: false,
            message: "device_locked"
        };

    }

    license.status = "active";

    license.device_id = device_id;

    return {
        success: true,
        tier: license.tier,
        message: "activation_success"
    };

};


/**
 * Check license status
 */
exports.getLicenseStatus = async (key) => {

    const license = licenses[key];

    if (!license) {

        return {
            success: false,
            message: "not_found"
        };

    }

    return {
        success: true,
        tier: license.tier,
        status: license.status
    };

};
