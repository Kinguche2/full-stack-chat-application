import { FormEvent, useState } from "react";
import { IoSearchSharp } from "react-icons/io5";
import useGetConversations from "../../hooks/useGetConversations";
import useConversation from "../../zustand/useConversation";
import toast from "react-hot-toast";
const SearchInput = () => {
  const [search, setSearch] = useState("");

  const { setCurrentConversation } = useConversation();
  const { conversations } = useGetConversations();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    // Perform search logic here ....
    if (!search) return;
    const conversation = conversations.find(
      (c) =>
        c.firstName?.toLowerCase().includes(search.toLowerCase()) ||
        c.lastName?.toLowerCase().includes(search.toLowerCase())
    );

    if (conversation) {
      setCurrentConversation(conversation);
      setSearch("");
    } else toast.error("No such user found!");
  };
  return (
    <div>
      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search..."
          className="input input-bordered rounded-full"
        />
        <button type="submit" className="btn btn-circle bg-sky-500 text-white">
          <IoSearchSharp className="w-6 h-6 outline-none" />
        </button>
      </form>
    </div>
  );
};

export default SearchInput;
