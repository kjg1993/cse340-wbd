const form = document.querySelector("#updateForm")
const updateBtn = document.querySelector("#submitButton")

form.addEventListener("change", function () {
    updateBtn.removeAttribute("disabled")
})