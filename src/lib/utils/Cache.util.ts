export async function getImageFromIndexedDB(url: string): Promise<string | null> {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open('ImageCache', 1);

        request.onerror = (event) => {
            reject('IndexedDB failed');
        };

        request.onsuccess = (event) => {
            const db = (event.target as IDBRequest).result;
            const transaction = db.transaction('images', 'readonly');
            const objectStore = transaction.objectStore('images');
            const getRequest = objectStore.get(url);

            getRequest.onsuccess = () => {
                if (getRequest.result) {
                    resolve(getRequest.result);
                } else {
                    resolve(null);
                }
            };

            getRequest.onerror = () => {
                resolve(null);
            };
        };

        request.onupgradeneeded = (event) => {
            const db = (event.target as IDBRequest).result;
            db.createObjectStore('images');
        };
    });
}

export async function saveImageToIndexedDB(url: string, base64Image: string): Promise<void> {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open('ImageCache', 1);

        request.onerror = (event) => {
            reject('IndexedDB failed');
        };

        request.onsuccess = (event) => {
            const db = (event.target as IDBRequest).result;
            const transaction = db.transaction('images', 'readwrite');
            const objectStore = transaction.objectStore('images');
            const putRequest = objectStore.put(base64Image, url);

            putRequest.onsuccess = () => {
                resolve();
            };

            putRequest.onerror = () => {
                reject('Failed to save image');
            };
        };

        request.onupgradeneeded = (event) => {
            const db = (event.target as IDBRequest).result;
            db.createObjectStore('images');
        };
    });
}

export async function getImage(url: string): Promise<string> {
    const cachedImage = await getImageFromIndexedDB(url);

    if (cachedImage) {
        return cachedImage;
    } else {
        const response = await fetch(url);
        const blob = await response.blob();
        const reader = new FileReader();

        return new Promise((resolve) => {
            reader.onloadend = async () => {
                const base64Image = reader.result as string;
                await saveImageToIndexedDB(url, base64Image);
                resolve(base64Image);
            };

            reader.readAsDataURL(blob);
        });
    }
}  