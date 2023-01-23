export interface Event {
    id: string;
    category: string;
    title: string;
    description: string;
    image: string;
    file:string;
    location: string;
    start: Date;
    day: Date;
    isDeleting: boolean ;
}
