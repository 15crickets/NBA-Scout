type SearchBarProps = {
    onSearch: (playerName: string) => void
}

export default function SearchBar({ onSearch }: SearchBarProps) {
    return (
        <div>
            <input className=""/>
            <button>Search</button>
        </div>
    )
}