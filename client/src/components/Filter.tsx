import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { ListFilter } from "lucide-react";
import { Button } from "./ui/button";

const Filter = ({ genres, setSelectedGenre }) => {
    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button>
                    <ListFilter />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="p-4">
                <ul className="space-y-2">
                    {/* Voeg de optie "Alle tracks" toe */}
                    <li 
                        onClick={() => setSelectedGenre(null)} 
                        className="cursor-pointer hover:bg-gray-200 p-2 rounded-md"
                    >
                        All
                    </li>

                    {/* Voeg de genres toe */}
                    {genres.map((genre) => (
                        <li 
                            key={genre} 
                            onClick={() => setSelectedGenre(genre)} 
                            className="cursor-pointer hover:bg-gray-200 p-2 rounded-md"
                        >
                            {genre}
                        </li>
                    ))}
                </ul>
            </PopoverContent>
        </Popover>
    );
};

export default Filter;
