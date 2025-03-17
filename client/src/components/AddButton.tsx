import { Button } from "./ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";

const AddButton = () => {
    return (
        <Link href="/add-track">
            <Button variant="outline">
                <Plus />
            </Button>
        </Link>
    )
}

export default AddButton;