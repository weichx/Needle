export interface Indexable<T> {
    [key: string]: T;
}
export interface IndexableObject {
    [key: string]: any;
}
export interface Creator<T> {
    new (): T;
}
