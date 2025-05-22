const supabaseUrl = 'https://kkvlvhgwnurqffizviss.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtrdmx2aGd3bnVycWZmaXp2aXNzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc5NDg5NzYsImV4cCI6MjA2MzUyNDk3Nn0.COFES5GgdsFDB7nhUyf_bK9sC55-lMyYb7YL8NTvkfE.';
const supabase = supabase.createClient(supabaseUrl, supabaseKey);

document.getElementById('queueForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const name = e.target.name.value;
  const role = e.target.role.value;
  const service = e.target.service.value;
  const purpose = e.target.purpose.value;

  const { error } = await supabase.from('queue').insert([{ name, role, service, purpose }]);
  if (error) {
    alert('Failed to join queue: ' + error.message);
  } else {
    alert('You have been added to the queue!');
    e.target.reset();
  }
});

supabase.auth.getSession().then(({ data }) => {
  if (data.session) {
    document.querySelector('.welcome').innerHTML = `<h2>Welcome, ${data.session.user.email}</h2><p>Fill out the form below to join the queue.</p>`;
    document.getElementById('queueForm').style.display = 'flex';
  }
});

document.getElementById('registerForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = e.target.email.value;
  const password = e.target.password.value;
  const { error } = await supabase.auth.signUp({ email, password });
  if (error) {
    alert('Registration failed: ' + error.message);
  } else {
    alert('Check your email to confirm your registration!');
  }
});

document.getElementById('loginForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = e.target.email.value;
  const password = e.target.password.value;
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    alert('Login failed: ' + error.message);
  } else {
    alert('Login successful!');
    window.location.href = "index.html";
  }
});
