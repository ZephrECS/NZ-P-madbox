// pk3-loader.js
(async () => {
    const parts = [
        "https://cdn.jsdelivr.net/gh/ZephrECS/NZ-P-madbox@main/NZP/game.pk3.part1",
        "https://cdn.jsdelivr.net/gh/ZephrECS/NZ-P-madbox@main/NZP/game.pk3.part2",
        "https://cdn.jsdelivr.net/gh/ZephrECS/NZ-P-madbox@main/NZP/game.pk3.part3",
        "https://cdn.jsdelivr.net/gh/ZephrECS/NZ-P-madbox@main/NZP/game.pk3.part4",
        "https://cdn.jsdelivr.net/gh/ZephrECS/NZ-P-madbox@main/NZP/game.pk3.part5"
    ];

    const buffers = [];
    for (const url of parts) {
        const res = await fetch(url, { cache: "force-cache" });
        if (!res.ok) throw new Error("Failed to load " + url);
        buffers.push(await res.arrayBuffer());
    }

    const totalSize = buffers.reduce((sum, buf) => sum + buf.byteLength, 0);
    const merged = new Uint8Array(totalSize);
    let offset = 0;
    for (const buf of buffers) {
        merged.set(new Uint8Array(buf), offset);
        offset += buf.byteLength;
    }

    // create a Blob URL and store it in a global so index.html can use it
    const blob = new Blob([merged], { type: "application/octet-stream" });
    window.NZP_GAME_PK3_URL = URL.createObjectURL(blob);
})();
