async function app() {
    const [user, posts] = await Promise.all([
        getJSON("/api/currentUser"),
        getJSON("/api/posts")
    ]);

    handleUser(user);
    renderPosts(posts);
}

app();

function handleUser(user: any) {
    if (!user) {
        return;
    }

    document.body.classList.add("logged-in");
    document.getElementById("username")!.textContent = user.username;

    document.forms.namedItem("create-post")?.addEventListener("submit", async (e) => {
        e.preventDefault();

        const formData = new FormData(e.target);
        const body = JSON.stringify({
            subject: formData.get("subject"),
            content: formData.get("content")
        });

        await fetch("/api/posts", {
            method: "POST",
            body,
            headers: {
                "Content-Type": "application/json",
                "Content-Length": body.length.toString()
            }
        });

        window.location.reload();
    });
}

function renderPosts(posts: any) {
    const postsList = document.getElementById("posts");

    if (!postsList) {
        throw new Error();
    }

    postsList.innerHTML = posts
        .map((post: any) => `<li>
            <time datetime="${post.createdAt}">${new Date(post.createdAt).toLocaleDateString()}</time>
            <h2>${post.subject}</h2>
            <span>${post.user.username.replaceAll("<", "&lt;")}</span>
        </li>`)
        .join("\n");
}

async function getJSON(path: string) {
    const res = await fetch(path);

    return await res.json();
}
