import os from 'os';
import app from "./app.js";

// Handle uncaught exceptions and unhandled rejections to surface errors
process.on('uncaughtException', (err) => {
    console.error('❌ Uncaught Exception:', err);
    process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
    process.exit(1);
});

const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || '0.0.0.0';

app.listen(PORT, HOST, () => {
    console.log('='.repeat(60));
    console.log(`🚀 Server listening on ${HOST}:${PORT}`);
    console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log('='.repeat(60));

    // Print local IPv4 addresses to help connecting from other devices on the LAN
    const nets = os.networkInterfaces();
    const addresses = [];
    
    for (const name of Object.keys(nets)) {
        for (const net of nets[name]) {
            // Skip internal and non-IPv4 addresses
            if (net.family === 'IPv4' && !net.internal) {
                addresses.push(net.address);
            }
        }
    }
    
    if (addresses.length) {
        console.log('📱 Accessible on local network:');
        for (const ip of addresses) {
            console.log(`   http://${ip}:${PORT}/`);
        }
        console.log('='.repeat(60));
    } else {
        console.log('⚠️  No non-internal IPv4 addresses detected.');
        console.log('='.repeat(60));
    }
});