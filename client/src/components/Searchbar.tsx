import { Input } from "@/components/ui/input"

export default function Searchbar({ searchTerm, setSearchTerm }) {
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value); // update the search term
  };

  return (
    <div className="flex items-center w-full max-w-sm space-x-2 rounded-lg border border-gray-300 px-3.5 py-2">
      <SearchIcon className="h-4 w-4" />
      <Input
        type="search"
        placeholder="Search"
        className="w-full border-0 h-8 font-semibold"
        value={searchTerm} // bind the search input to the searchTerm state
        onChange={handleSearchChange} // handle input changes
      />
    </div>
  )
}

function SearchIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  )
}
