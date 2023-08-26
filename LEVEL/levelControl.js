var levelnum;
function showModal(level) {
  const modal = document.getElementById('myPop');
  modal.style.display = 'flex';
  levelnum = level;
}

function closeModal(confirm) {
  const modal = document.getElementById('myPop');
  modal.style.display = 'none';
  if (confirm) {
    window.location.href = 'level.html?number='+levelnum;
  }
}