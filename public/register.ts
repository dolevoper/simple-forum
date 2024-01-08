interface SubmitEvent {
    target: HTMLFormElement;
}

document.forms.namedItem("register")?.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const body = JSON.stringify({
        email: formData.get("email"),
        username: formData.get("username"),
        password: formData.get("password")
    });

    const res = await fetch("/api/auth/register", {
        method: "POST",
        body,
        headers: {
            "Content-Type": "application/json",
            "Content-Length": body.length.toString()
        }
    });

    if (res.status >= 400) {
        throw new Error();
    }

    window.location.replace("/");
});

document.getElementById("toggle-password")?.addEventListener("click", (e) => {
    const input = document.forms.namedItem("register")?.elements.namedItem("password") as HTMLInputElement | null;

    if (!input) {
        throw new Error();
    }

    input.type = input.type === "password" ? "text" : "password";
    (e.target as HTMLSpanElement).innerText = input.type === "password" ? "Show" : "Hide";
});
