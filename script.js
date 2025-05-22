const supabaseUrl = 'https://kkvlvhgwnurqffizviss.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtrdmx2aGd3bnVycWZmaXp2aXNzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc5NDg5NzYsImV4cCI6MjA2MzUyNDk3Nn0.COFES5GgdsFDB7nhUyf_bK9sC55-lMyYb7YL8NTvkfE';
const supabase = supabase.createClient(supabaseUrl, supabaseKey);

// On page load - check session
async function checkSession() {
  const { data, error } = await supabase.auth.getSession();
  if (error) {
    alert('Error checking session: ' + error.message);
    return;
  }
  if (!data.session) {
    // No logged in user, redirect to login page
    window.location.href = 'login.html';
  } else {
    // Show welcome message and queue form
    document.querySelector('.welcome').innerHTML = `<h2>Welcome, ${data.session.user.email}</h2><p>Fill out the form below to join the queue.</p>`;
    document.getElementById('queueForm').style.display = 'flex';
  }
}

checkSession();

// Queue form submit
document.getElementById('queueForm').addEventListener('submit', async (e) => {
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

// Logout button
document.querySelector('.logout').addEventListener('click', async () => {
  const { error } = await supabase.auth.signOut();
  if (error) {
    alert('Logout failed: ' + error.message);
  } else {
    window.location.href = 'login.html';
  }
});
