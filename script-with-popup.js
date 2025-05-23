
const supabaseUrl = 'https://kkvlvhgwnurqffizviss.supabase.co';
const supabaseKey = 'YOUR_KEY_HERE';
const supabase = supabase.createClient(supabaseUrl, supabaseKey);

// On page load
async function checkSession() {
  const { data } = await supabase.auth.getSession();
  if (!data.session) {
    window.location.href = 'login.html';
  } else {
    document.querySelector('.welcome').innerHTML = `Welcome, ${data.session.user.email}.<br>Please fill out the form to join the queue.`;
  }
}

// Queue form submission
if (document.getElementById('queueForm')) {
  document.getElementById('queueForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = e.target.name.value;
    const role = e.target.role.value;
    const service = e.target.service.value;
    const purpose = e.target.purpose.value;

    const { data, error } = await supabase.from('queue').insert([{ name, role, service, purpose }]).select();
    if (error) {
      alert('Error joining queue: ' + error.message);
    } else {
      const id = data[0].id;
      const waitEstimate = estimateWaitTime(id, service);
      alert(`Queue Number: ${id}\nService: ${service}\nEstimated wait time: ${waitEstimate} minutes`);
      e.target.reset();
    }
  });
}

// Simple wait time estimation (15 per hour = 4 per 15 mins)
function estimateWaitTime(queueId, service) {
  const position = queueId % 15; // crude approximation
  return Math.ceil(position * 4);
}

// Logout
if (document.querySelector('.logout')) {
  document.querySelector('.logout').addEventListener('click', async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      alert('Logout failed: ' + error.message);
    } else {
      window.location.href = 'login.html';
    }
  });
}

// Initialize session check
if (window.location.pathname.includes('index.html')) {
  checkSession();
}
