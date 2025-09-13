// ... [other code above]

// INSTALL PROMPT LOGIC (update)
let deferredPrompt;
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  show($('#installPrompt'));
});

$('#getMobileAppBtn').onclick = function() {
  // If the prompt event is available, show it
  if (deferredPrompt) {
    show($('#installPrompt'));
  } else {
    // fallback instructions
    alert("To install: Use your browser's menu and select 'Add to Home screen'.");
  }
};
$('#installNowBtn').onclick = async function() {
  if (deferredPrompt) {
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      hide($('#installPrompt'));
      // Optional: Show a confirmation or animation
      alert('App is being installed! You can now launch it from your home screen.');
    }
  } else {
    alert("To install: Use your browser's menu and select 'Add to Home screen'.");
  }
};
$('#maybeLaterBtn').onclick = function() {
  hide($('#installPrompt'));
};