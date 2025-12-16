import { connectDB } from './database.js';
import { DatabaseService } from './services/databaseService.js';
async function testRetrieveDocument() {
    await connectDB();
    try {
        // Check and insert login use case if needed
        let existing = await DatabaseService.findOneDocument('use_case_db', { name: 'login' });
        if (!existing) {
            console.log('Inserting sample login use case...');
            await DatabaseService.insertDocument('use_case_db', {
                name: 'login',
                title: 'User Login Use Case',
                description: 'This use case describes the process of user authentication and login to the system.',
                steps: [
                    'User enters username and password',
                    'System validates credentials',
                    'If valid, grant access and redirect to dashboard',
                    'If invalid, show error message'
                ],
                actors: ['User', 'Authentication System'],
                preconditions: ['User has account', 'System is available'],
                postconditions: ['User is logged in or error shown']
            });
            console.log('Sample login use case inserted.');
        }
        // Check and insert signup use case if needed
        existing = await DatabaseService.findOneDocument('use_case_db', { name: 'signup' });
        if (!existing) {
            console.log('Inserting sample signup use case...');
            await DatabaseService.insertDocument('use_case_db', {
                name: 'signup',
                title: 'User Signup Use Case',
                description: 'This use case describes the process of user registration and account creation.',
                steps: [
                    'User clicks signup button',
                    'User fills registration form (username, email, password)',
                    'System validates input data',
                    'System checks for existing username/email',
                    'If valid and unique, create account and send confirmation',
                    'User confirms email and account is activated'
                ],
                actors: ['User', 'Registration System'],
                preconditions: ['User does not have account', 'System is available'],
                postconditions: ['User account created or error shown']
            });
            console.log('Sample signup use case inserted.');
        }
        // Retrieve the signup use case
        const signupUseCase = await DatabaseService.findOneDocument('use_case_db', { name: 'signup' });
        console.log('Signup use case document:', JSON.stringify(signupUseCase, null, 2));
    }
    catch (error) {
        console.error('Error:', error);
    }
    finally {
        process.exit(0);
    }
}
testRetrieveDocument();
//# sourceMappingURL=test-db.js.map