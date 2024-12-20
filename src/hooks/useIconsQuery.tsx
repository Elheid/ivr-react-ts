import { useQuery } from "@tanstack/react-query";


export const useIconsQuery = (playload: { svgUrl: string }, options = {}) => {
    const query = useQuery({
        queryKey: ['svg', playload.svgUrl],
        queryFn: async () => {
            const response = await fetch(playload.svgUrl);
            return response.text();
        },
        ...options
    })
    return query;
}