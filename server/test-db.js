const bcrypt = require('bcryptjs');
const { getAdmin } = require('./database');

async function testLogin() {
  const username = 'admin';
  const inputPassword = 'admin123';
  
  try {
    const admin = await getAdmin(username);
    console.log('Retrieved admin row:', admin);
    
    if (!admin) {
      console.log('FAIL: Admin not found in DB!');
      return;
    }
    
    const isMatch = bcrypt.compareSync(inputPassword, admin.password);
    console.log('Password comparison result:', isMatch);
    
    if (isMatch) {
      console.log('SUCCESS: Credentials are correct!');
    } else {
      console.log('FAIL: Password did not match hashed password in DB:', admin.password);
    }
  } catch (err) {
    console.error('Unexpected error:', err);
  }
}

testLogin();
