import fetch from 'node-fetch';

async function login() {
  try {
    const res = await fetch('https://app.teable.io/api/auth/signin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'dynamicmike@gmail.com',
        password: 'dormobile1'
      })
    });
    
    if (!res.ok) {
      console.log('Status:', res.status);
      const text = await res.text();
      console.log('Error:', text);
      return;
    }
    
    const data = await res.json();
    console.log('Login successful:', data);
  } catch (error) {
    console.error('Error logging in:', error);
  }
}

login();
