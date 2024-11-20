function Tail() {
    const backTop = () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    const scrollBottom = () => {
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    };
  return (
    <div className="fixed bottom-0 right-0 m-4 flex flex-col bg-white rounded-lg shadow-lg p-2">
        <button onClick={backTop}>⇧</button>
        <button onClick={scrollBottom}>⇩</button>
    </div>
  );
}

export default Tail
