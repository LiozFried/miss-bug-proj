const { useState, useEffect } = React

export function BugFilter({ filterBy, onSetFilterBy }) {

    const [filterByToEdit, setFilterByToEdit] = useState(filterBy)

    useEffect(() => {
        onSetFilterBy(filterByToEdit)
    }, [filterByToEdit])

    function handleChange({ target }) {
        const field = target.name
        let value = target.value

        switch (target.type) {
            case 'number':
            case 'range':
                value = +value || ''
                break

            case 'checkbox':
                value = target.checked
                break

            default:
                break
        }

        setFilterByToEdit(prevFilter => ({ ...prevFilter, [field]: value }))
    }

    // function onSubmitFilter(ev) {
    //     ev.preventDefault()
    //     onSetFilterBy(filterByToEdit)
    // }

    // function onSortChange({ target }) {
    //     const field = target.name
    //     let value = target.value

    //     setFilterByToEdit(prevFilter => {
    //         const newSortDir = (prevFilter.sortBy === value) ? -prevFilter.sortDir : 1
    //         return { ...prevFilter, sortBy: value, sortDir: newSortDir }
    //     })
    // }

    // function onSortDirChange({ target }) {
    //     const value = target.value
    //     setFilterByToEdit(prevFilter => ({ ...prevFilter, sortDir: +value }))
    // }

    const { txt, minSeverity, sortBy, sortDir } = filterByToEdit

    return (
        <section className="bug-filter">
            <h2>Filter & Sort</h2>
            <form onSubmit={ev => ev.preventDefault()}>
                <label htmlFor="txt">Text: </label>
                <input value={txt} onChange={handleChange} type="text" placeholder="By Text" id="txt" name="txt" />

                <label htmlFor="minSeverity">Min Severity: </label>
                <input value={minSeverity} onChange={handleChange} type="number" placeholder="By Min Severity" id="minSeverity" name="minSeverity" />

                <div className="sort-controls">
                    <label htmlFor="sortBy">Sort by:</label>
                    <select name="sortBy" id="sortBy" value={sortBy} onChange={handleChange}>
                        <option value="">Select</option>
                        <option value="title">Title</option>
                        <option value="severity">Severity</option>
                        <option value="createdAt">Created At</option>
                    </select>

                    <label htmlFor="sortDir">Direction:</label>
                    <select name="sortDir" id="sortDir" value={sortDir} onChange={handleChange}>
                        <option value="1">Ascending</option>
                        <option value="-1">Descending</option>
                    </select>
                </div>
            </form>
        </section>
    )
}