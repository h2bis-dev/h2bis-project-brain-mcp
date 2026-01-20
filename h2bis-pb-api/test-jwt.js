// Quick JWT test to verify signing and verification
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

dotenv.config();

const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || 'default-access-secret-change-in-production';

console.log('=== JWT Debug Test ===\n');
console.log('JWT_ACCESS_SECRET first 30 chars:', JWT_ACCESS_SECRET.substring(0, 30) + '...');
console.log('JWT_ACCESS_SECRET length:', JWT_ACCESS_SECRET.length);
console.log('');

// Test payload
const testPayload = {
    userId: "69674df605109cc722a84180",
    email: "test6@gmail.com",
    roles: ["user"]
};

console.log('Test Payload:', JSON.stringify(testPayload, null, 2));
console.log('');

// Sign the token
const token = jwt.sign(testPayload, JWT_ACCESS_SECRET, {
    expiresIn: 3600
});

console.log('Generated Token:', token);
console.log('');

// Verify the token
try {
    const decoded = jwt.verify(token, JWT_ACCESS_SECRET);
    console.log('✅ Verification SUCCESSFUL!');
    console.log('Decoded Payload:', JSON.stringify(decoded, null, 2));
} catch (error) {
    console.log('❌ Verification FAILED!');
    console.log('Error:', error.message);
}

console.log('\n=== Test Complete ===');
