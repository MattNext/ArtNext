import * as BunnySDK from "@bunny.net/storage-sdk";

const storageZone = BunnySDK.zone.connect_with_accesskey(
    BunnySDK.regions.StorageRegion.Falkenstein,
    process.env.BUNNY_STORAGE_ZONE!,
    process.env.BUNNY_STORAGE_API_KEY!
);

export async function uploadToBunny(path: string, data: ArrayBuffer | Uint8Array): Promise<string> {
    await BunnySDK.file.upload(storageZone, path, new Blob([data]).stream());
    return `https://${process.env.BUNNY_CDN_HOSTNAME}/${path}`;
}

export async function deleteFromBunny(path: string): Promise<void> {
    await BunnySDK.file.remove(storageZone, path);
}

// håndterer al fil upload samt sletning mellem bruger/server og bunny