

const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay));

var interval = 1000;

function displayToast() {
  toasts.forEach((item, i) => {
    setTimeout(async function () {
      //Add element
      const newToast = document.createElement("toast");
      newToast.classList.add(item.type);
      newToast.innerHTML = `<p>${item.title}</p><small>${item.body}</small>`;
      toastContainer.prepend(newToast);

      //Add animation
      var toast = document.querySelector("toast");
      toast.style.animation = "pop-up 6s ease-in-out forwards";

      //Remove toast
      toasts.splice([i]);
      await sleep(6000);
      newToast.remove();
    }, i * interval);
  });
}

function createToast(title, body, type) {
  var toast = {
    title: title
    body: body;
    type: type;
  };

  toasts.push(toast);
  displayToast();
}