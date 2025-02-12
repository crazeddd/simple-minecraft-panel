export default function Graph({data}: any) {
    const {x, y} = data;
    return(
        <>
        <p>{x}</p>
        <p>{y}</p>
        </>
    );
}