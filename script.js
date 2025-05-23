const supabase = supabase.createClient(
  'https://kkvlvhgwnurqffizviss.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtrdmx2aGd3bnVycWZmaXp2aXNzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc5NDg5NzYsImV4cCI6MjA2MzUyNDk3Nn0.COFES5GgdsFDB7nhUyf_bK9sC55-lMyYb7YL8NTvkfE'
);

// Check session
async function checkSession() {
  const { data } = await supabase.auth.getSession();
  if (!data.session) {
    window.location.href = 'login.html';
  } else {
    document.querySelector('.welcome').innerHTML = `Welcome, ${data.session.user.email}<br><br>Fill the form to join the queue.`;
    document.getElementById('queueForm').style.display = 'block';
  }
}

checkSession();

document.getElementById('queueForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const name = e.target.name.value;
  const role = e.target.role.value;
  const service = e.target.service.value;
  const purpose = e.target.purpose.value;

  const { data, error } = await supabase.from('queue').insert([{ name, role, service, purpose }]).select();
  if (error) return alert('Error: ' + error.message);

  const queueNumber = data[0].id;
  const estWait = (queueNumber % 15) * 4;
  alert(`🎟️ Queue Number: ${queueNumber}\\nEstimated wait: ${estWait} minutes`);
  e.target.reset();
});

document.querySelector('.logout').addEventListener('click', async () => {
  const { error } = await supabase.auth.signOut();
  if (!error) {
    window.location.href = 'login.html';
  }
});
