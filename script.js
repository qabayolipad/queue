const supabaseUrl = 'https://kkvlvhgwnurqffizviss.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtrdmx2aGd3bnVycWZmaXp2aXNzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc5NDg5NzYsImV4cCI6MjA2MzUyNDk3Nn0.COFES5GgdsFDB7nhUyf_bK9sC55-lMyYb7YL8NTvkfE';
const supabase = supabase.createClient(supabaseUrl, supabaseKey);

async function checkSession() {
  const { data, error } = await supabase.auth.getSession();
  if (data?.session) {
    window.location.href = "index.html";
  }
}

// Registration
if (document.getElementById('registerForm')) {
  document.getElementById('registerForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) return alert('Registration failed: ' + error.message);
    alert("Registered successfully! Please log in.");
    window.location.href = 'login.html';
  });
}

// Login
if (document.getElementById('loginForm')) {
  document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return alert('Login failed: ' + error.message);
    window.location.href = 'index.html';
  });
}

// Queue
if (document.getElementById('queueForm')) {
  window.addEventListener('load', async () => {
    const { data } = await supabase.auth.getSession();
    if (!data.session) return window.location.href = "login.html";

    document.querySelector('.welcome').innerHTML = `Welcome, ${data.session.user.email}`;
  });

  document.getElementById('queueForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = e.target.name.value;
    const role = e.target.role.value;
    const service = e.target.service.value;
    const purpose = e.target.purpose.value;

    const { data, error } = await supabase.from('queue').insert([{ name, role, service, purpose }]).select();
    if (error) return alert('Error: ' + error.message);
    const id = data[0].id;
    alert(`You are successfully added! Your queue number is: ${id}`);
    e.target.reset();
  });

  document.querySelector('.logout').addEventListener('click', async () => {
    await supabase.auth.signOut();
    window.location.href = 'login.html';
  });
}
