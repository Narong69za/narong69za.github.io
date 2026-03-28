/**
 * =====================================================
 * PROJECT: SN DESIGN STUDIO
 * MODULE: controllers/activate.controller.js
 * VERSION: 1.0.0
 * STATUS: ACTIVE
 * LAST FIX: Initial activation controller
 * =====================================================
 */

const licenseService = require("../services/license.service");

exports.generateFreeKey = async (req, res) => {

    try {

        const key = await licenseService.createFreeKey();

        return res.json({
            success: true,
            key: key
        });

    } catch (err) {

        return res.status(500).json({
            success: false,
            message: "generate_key_failed"
        });

    }

};


exports.activateLicense = async (req, res) => {

    try {

        const { key, device_id } = req.body;

        const result = await licenseService.activateKey(key, device_id);

        return res.json(result);

    } catch (err) {

        return res.status(500).json({
            success: false,
            message: "activation_error"
        });

    }

};


exports.checkLicenseStatus = async (req, res) => {

    try {

        const { key } = req.query;

        const status = await licenseService.getLicenseStatus(key);

        return res.json(status);

    } catch (err) {

        return res.status(500).json({
            success: false,
            message: "status_error"
        });

    }

};
