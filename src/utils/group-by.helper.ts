export const groupBy = <K, V>(array: V[], grouper: (item: V) => K): Promise<Map<K, V[]>> => {
    return new Promise((resolve, reject) => {
        try {
            const group = array.reduce((store, item) => {
                const key = grouper(item);

                if (!store.has(key)) {
                    store.set(key, [item])
                } else {
                    store.get(key)?.push(item)
                }
                return store;
            }, new Map<K, V[]>());

            resolve(group);
        } catch (err) {
            reject(err);
        }
    });
}
