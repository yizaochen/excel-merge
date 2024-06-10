function convertBytesTokB(bytes) {
  return (bytes / 1024).toFixed(1);
}

function FileRow({ fileID, file }) {
  return (
    <tr>
      <td>{fileID}</td>
      <td>{file.name}</td>
      <td>{convertBytesTokB(file.size)}</td>
    </tr>
  );
}

export default FileRow;
