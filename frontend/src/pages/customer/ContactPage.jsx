import React from "react";

const ContactPage = () => {
  return (
    <div className="container mx-auto px-4">
      <h1 className="text-3xl font-bold mb-4">Liên Hệ Chúng Tôi</h1>
      <p className="mb-4">
        Nếu bạn có bất kỳ câu hỏi nào, vui lòng điền vào biểu mẫu dưới đây và chúng tôi sẽ phản hồi bạn sớm nhất có thể.
      </p>

      <form
        className="bg-white p-6 rounded shadow-md"
        onSubmit={(e) => {
          
          e.preventDefault();
        }}
      >
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
            Tên của bạn
          </label>
          <input
            type="text"
            id="name"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
            Email của bạn
          </label>
          <input
            type="email"
            id="email"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="message">
            Tin nhắn
          </label>
          <textarea
            id="message"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            rows={4}
            required
          />
        </div>

        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Gửi
        </button>
      </form>
    </div>
  );
};

export default ContactPage;
