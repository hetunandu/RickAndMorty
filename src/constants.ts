export const fetchItemsUrl = (page: number) => `https://rickandmortyapi.com/api/character/?page=${page}`;
export const searchItemsUrl = (query: string) => `https://rickandmortyapi.com/api/character/?name=${query}`;