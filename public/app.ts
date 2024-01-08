async function app() {
    const res = await fetch("/api/posts");
    const posts = await res.json();

    const postsList = document.getElementById("posts");

    if (!postsList) {
        throw new Error();
    }

    postsList.innerHTML = posts
        .map((post: any) => `<li>
            <time datetime="${post.createdAt}">${new Date(post.createdAt).toLocaleDateString()}</time>
            <h2>${post.subject}</h2>
            <span>${post.user.username}</span>
        </li>`)
        .join("\n");
}

app();
