module.exports = {
    run: async function (req, res) {
        return res.status(200).json({
            size: {
                16: "https://cdn.discordapp.com/avatars/702935974308741140/1dc53bc2339e62b24abd308c7168bd76.png?size=16",
                32: "https://cdn.discordapp.com/avatars/702935974308741140/1dc53bc2339e62b24abd308c7168bd76.png?size=32",
                64: "https://cdn.discordapp.com/avatars/702935974308741140/1dc53bc2339e62b24abd308c7168bd76.png?size=64",
                128: "https://cdn.discordapp.com/avatars/702935974308741140/1dc53bc2339e62b24abd308c7168bd76.png?size=128",
                256: "https://cdn.discordapp.com/avatars/702935974308741140/1dc53bc2339e62b24abd308c7168bd76.png?size=256",
                512: "https://cdn.discordapp.com/avatars/702935974308741140/1dc53bc2339e62b24abd308c7168bd76.png?size=512",
                1024: "https://cdn.discordapp.com/avatars/702935974308741140/1dc53bc2339e62b24abd308c7168bd76.png?size=1024",
                2048: "https://cdn.discordapp.com/avatars/702935974308741140/1dc53bc2339e62b24abd308c7168bd76.png?size=2048",
                4096: "https://cdn.discordapp.com/avatars/702935974308741140/1dc53bc2339e62b24abd308c7168bd76.png?size=4096"
            }
        });
    }
}