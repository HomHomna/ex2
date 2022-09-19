import TableData from "./Table";

export default function App() {
  // const 
  return (
    <div>
      <div className="ml-12 mt-8 block">
        <h3 className="text-2xl font-bold	mb-0">Bank Accounts</h3>
        <div className="text-base ">Please provide us with your bank account details to facilitate any payments due to you</div>
        <TableData />
      </div>
    </div>
  )
}