export default function SignUpCard() {
  return (
    <div style={{ background: '#fff', border: '1px solid #ddd', borderRadius: '10px', padding: '28px', maxWidth: '400px' }}>
      <h2 style={{ fontSize: '22px', color: '#1a1a1a', marginBottom: '18px' }}>Create your account</h2>

      <div style={{ background: '#fdecea', color: '#d93025', padding: '10px 14px', borderRadius: '6px', marginBottom: '16px' }}>
        This email is already registered.
      </div>

      <input placeholder="Full name" style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '6px', marginBottom: '12px' }} />
      <input placeholder="Email" type="email" style={{ width: '100%', padding: '10px', border: '1px solid #d93025', borderRadius: '6px', marginBottom: '12px' }} />
      <input placeholder="Password" type="password" style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '6px', marginBottom: '20px' }} />

      <button className="w-full bg-blue-500 hover:bg-blue-600 text-white py-[10px] rounded-[6px]">
        Create Account
      </button>

      <p style={{ fontSize: '13px', color: '#666', marginTop: '14px' }}>
        Already have an account? <a href="/login" style={{ color: '#1a73e8' }}>Log in</a>
      </p>
    </div>
  );
}
