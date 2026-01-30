// pk3-loader.js
async function loadGamePK3(parts) {
    const buffers = [];

    for (const url of parts) {
        const res = await fetch(url, { cache: "force-cache" });
        if (!res.ok) throw new Error("Failed to load " + url);
        buffers.push(await res.arrayBuffer());
    }

    const totalSize = buffers.reduce((a, b) => a + b.byteLength, 0);
    const merged = new Uint8Array(totalSize);

    let offset = 0;
    for (const buf of buffers) {
        merged.set(new Uint8Array(buf), offset);
        offset += buf.byteLength;
    }

    return new Blob([merged], { type: "application/octet-stream" });
}

(async () => {
    const gameBlob = await loadGamePK3([
        "https://cdn.jsdelivr.net/gh/ZephrECS/NZ-P-madbox@main/NZP/game.pk3.part1",
        "https://cdn.jsdelivr.net/gh/ZephrECS/NZ-P-madbox@main/NZP/game.pk3.part2",
        "https://cdn.jsdelivr.net/gh/ZephrECS/NZ-P-madbox@main/NZP/game.pk3.part3",
        "https://cdn.jsdelivr.net/gh/ZephrECS/NZ-P-madbox@main/NZP/game.pk3.part4",
        "https://cdn.jsdelivr.net/gh/ZephrECS/NZ-P-madbox@main/NZP/game.pk3.part5"
    ]);

    // Replace Module.files entry with merged game.pk3
    Module.files["nzp/game.pk3"] = await gameBlob.arrayBuffer();
})();
