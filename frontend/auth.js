const AUTH_SERVER_URL = 'http://localhost:3002';

// DOM Elements
const signInMetaMaskButton = document.getElementById('signInMetaMask');
const signInPhantomButton = document.getElementById('signInPhantom');
const signOutButton = document.getElementById('signOut');
const userInfoDiv = document.getElementById('userInfo');
const statusSpan = document.getElementById('status');
const userAddressSpan = document.getElementById('userAddress');
const jwtTokenSpan = document.getElementById('jwtToken');

// Event Listeners
signInMetaMaskButton.addEventListener('click', handleMetaMaskSignIn);
signInPhantomButton.addEventListener('click', handlePhantomSignIn);
signOutButton.addEventListener('click', handleSignOut);

// Check for existing session on page load
window.addEventListener('load', () => {
    const token = localStorage.getItem('jwtToken');
    if (token) {
        // Here you would typically verify the token with the server
        // For this example, we'll just decode it
        const payload = JSON.parse(atob(token.split('.')[1]));
        const address = payload.address || payload.publicKey;
        showUserInfo(address, token);
    }
});


async function handleMetaMaskSignIn() {
    if (!window.ethereum) {
        alert('Please install MetaMask!');
        return;
    }

    try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();
        const address = await signer.getAddress();

        // Request message to sign
        const response = await fetch(`${AUTH_SERVER_URL}/auth/evm/request-message`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ address })
        });
        const { message } = await response.json();

        // Get signature
        const signature = await signer.signMessage(message);

        // Verify signature and get JWT
        const verifyResponse = await fetch(`${AUTH_SERVER_URL}/auth/evm/verify-signature`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ address, signature })
        });

        if (!verifyResponse.ok) {
            throw new Error('Signature verification failed');
        }

        const { token } = await verifyResponse.json();
        localStorage.setItem('jwtToken', token);
        showUserInfo(address, token);

    } catch (error) {
        console.error('MetaMask sign-in error:', error);
        alert('Failed to sign in with MetaMask.');
    }
}

async function handlePhantomSignIn() {
    if (!window.solana || !window.solana.isPhantom) {
        alert('Please install Phantom wallet!');
        return;
    }

    try {
        await window.solana.connect();
        const publicKey = window.solana.publicKey.toString();
        
        // Request message to sign
        const response = await fetch(`${AUTH_SERVER_URL}/auth/solana/request-message`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ publicKey })
        });
        const { message } = await response.json();
        
        // Get signature
        const encodedMessage = new TextEncoder().encode(message);
        const signedMessage = await window.solana.signMessage(encodedMessage, "utf8");
        const signature = bs58.encode(signedMessage.signature);

        // Verify signature and get JWT
        const verifyResponse = await fetch(`${AUTH_SERVER_URL}/auth/solana/verify-signature`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ publicKey, signature })
        });

        if (!verifyResponse.ok) {
            throw new Error('Signature verification failed');
        }

        const { token } = await verifyResponse.json();
        localStorage.setItem('jwtToken', token);
        showUserInfo(publicKey, token);

    } catch (error) {
        console.error('Phantom sign-in error:', error);
        alert('Failed to sign in with Phantom.');
    }
}

function handleSignOut() {
    localStorage.removeItem('jwtToken');
    userInfoDiv.style.display = 'none';
    signInMetaMaskButton.style.display = 'block';
    signInPhantomButton.style.display = 'block';
    statusSpan.textContent = 'Not signed in';
}

function showUserInfo(address, token) {
    statusSpan.textContent = 'Signed In';
    userAddressSpan.textContent = address;
    jwtTokenSpan.textContent = token;
    userInfoDiv.style.display = 'block';
    signInMetaMaskButton.style.display = 'none';
    signInPhantomButton.style.display = 'none';
} 