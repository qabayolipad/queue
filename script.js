const supabaseUrl = 'https://kkvlvhgwnurqffizviss.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtrdmx2aGd3bnVycWZmaXp2aXNzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc5NDg5NzYsImV4cCI6MjA2MzUyNDk3Nn0.COFES5GgdsFDB7nhUyf_bK9sC55-lMyYb7YL8NTvkfE';
const supabase = supabase.createClient(supabaseUrl, supabaseKey);

async function checkSession() {
  const { data, error } = await supabase.auth.getSession();
  if (error || !data.session) {
    window.location.href = 'login.html';
    return;
  }
  const email = data.session.user.email;
  document.querySelector('.welcome').innerHTML = `
    <h2>Welcome, ${email}</h2>
    <p>Please fill out the form to join the queue.</p>
  `;
  document.getElementById('queueForm').style.display = 'flex';
}

checkSession();

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
    const { data, error: fetchError } = await supabase
      .from('queue')
      .select()
      .order('id', { ascending: true });

    if (!fetchError && data.length) {
      const position = data.length;
      const waitTime = position * 2; // approx 2 mins per person
      document.getElementById('queueInfo').innerHTML = `
        <strong>You are #${position} in the queue.</strong><br/>
        Estimated wait time: ${waitTime} minutes.
      `;
      document.getElementById('queueInfo').style.display = 'block';
    }

    e.target.reset();
  }
});

document.querySelector('.logout').addEventListener('click', async () => {
  const { error } = await supabase.auth.signOut();
  if (!error) {
    window.location.href = 'login.html';
  }
});
