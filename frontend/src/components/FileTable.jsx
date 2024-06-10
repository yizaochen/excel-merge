import Table from "react-bootstrap/Table";
import FileRow from "./FileRow";

function FileTable({ fileList }) {
  if (fileList.length === 0) {
    return null;
  }

  return (
    <Table striped bordered hover>
      <thead>
        <tr>
          <th>id</th>
          <th>File Name</th>
          <th>Size (kB)</th>
        </tr>
      </thead>
      <tbody>
        {Array.from(fileList).map((file, index) => (
          <FileRow key={index} fileID={index + 1} file={file} />
        ))}
      </tbody>
    </Table>
  );
}

export default FileTable;
