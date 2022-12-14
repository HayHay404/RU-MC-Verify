export async function mcToUUID(username : string) : Promise<string> {
    const response = await fetch(`https://api.mojang.com/users/profiles/minecraft/${username}`)
    const data = await response.json()
    return data.id
}

export async function uuidToMC(uuid : string) {
    const response = await fetch(`https://api.mojang.com/users/profiles/minecraft/${uuid}`)
    const data = await response.json()
    return data.name
}