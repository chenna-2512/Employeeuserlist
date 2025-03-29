import React, { useEffect, useState } from "react";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({ first_name: "", last_name: "", email: "", avatar: "" });
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(`https://reqres.in/api/users?page=${page}`);
        const data = await response.json();

        let deletedUsers = JSON.parse(localStorage.getItem("deletedUsers")) || [];
        let filteredUsers = data.data.filter(user => !deletedUsers.includes(user.id));

        setUsers(filteredUsers);
        setTotalPages(data.total_pages);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, [page]);

  const handleEdit = (user) => {
    setEditingUser(user.id);
    setFormData({ first_name: user.first_name, last_name: user.last_name, email: user.email, avatar: user.avatar });
  };

  const handleUpdate = async () => {
    try {
      const response = await fetch(`https://reqres.in/api/users/${editingUser}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setUsers(users.map(user => user.id === editingUser ? { ...user, ...formData } : user));
        setMessage("User updated successfully!");
      } else {
        setMessage("Failed to update user.");
      }
      setEditingUser(null);
    } catch (error) {
      console.error("Error updating user:", error);
      setMessage("Something went wrong.");
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`https://reqres.in/api/users/${id}`, { method: "DELETE" });

      if (response.ok) {
        setUsers(users.filter(user => user.id !== id));

        let deletedUsers = JSON.parse(localStorage.getItem("deletedUsers")) || [];
        deletedUsers.push(id);
        localStorage.setItem("deletedUsers", JSON.stringify(deletedUsers));

        setMessage("User deleted successfully!");
      } else {
        setMessage("Failed to delete user.");
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      setMessage("Something went wrong.");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4 text-center">Users List</h2>
      {message && <p className="text-center text-green-500 mb-4">{message}</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {users.map((user) => (
          <div key={user.id} className="bg-white p-4 rounded-lg shadow-md flex flex-col items-center">
            <img src={user.avatar} alt={user.first_name} className="w-26 h-26 rounded-full mb-2" />
            <p className="text-xl font-medium">{user.first_name} {user.last_name}</p>
            <p className="text-lg text-gray-500">{user.email}</p>
            <div className="flex gap-2 mt-2">
              <button onClick={() => handleEdit(user)} className="px-3 py-3 bg-yellow-500 text-white rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-6">
                  <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
                </svg>
              </button>
              <button onClick={() => handleDelete(user.id)} className="px-3 py-3 bg-red-500 text-white rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-6">
                  <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>

      {editingUser && (
        <div className="mt-6 p-4 bg-gray-100 rounded">
          <h3 className="text-lg font-bold">Edit User</h3>
          <input type="text" value={formData.first_name} onChange={(e) => setFormData({ ...formData, first_name: e.target.value })} className="border p-2 rounded w-full mt-2" placeholder="First Name" />
          <input type="text" value={formData.last_name} onChange={(e) => setFormData({ ...formData, last_name: e.target.value })} className="border p-2 rounded w-full mt-2" placeholder="Last Name" />
          <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="border p-2 rounded w-full mt-2" placeholder="Email" />
          <button onClick={handleUpdate} className="px-4 py-2 bg-blue-500 text-white rounded mt-4">Update</button>
        </div>
      )}

      <div className="flex justify-center items-center mt-10 gap-4">
        <button disabled={page === 1} onClick={() => setPage(page - 1)} className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300">Prev</button>
        <span>Page {page} of {totalPages}</span>
        <button disabled={page === totalPages} onClick={() => setPage(page + 1)} className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300">Next</button>
      </div>
    </div>
  );
};

export default Users;
