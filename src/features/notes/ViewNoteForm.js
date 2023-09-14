import { useGetNotesQuery } from './notesApiSlice'
import { memo } from 'react'

const Note = ({ noteId }) => {

    const { note } = useGetNotesQuery("notesList", {
        selectFromResult: ({ data }) => ({
            note: data?.entities[noteId]
        }),
    })

    

    if (note) {
        return (
            <div class="card">
                <div class="card-title">
                <h2>{note.title}</h2>
                </div>
                <p>{note.text}</p>
                
            </div>
        )

    } else return null
}

const memoizedNote = memo(Note)

export default memoizedNote