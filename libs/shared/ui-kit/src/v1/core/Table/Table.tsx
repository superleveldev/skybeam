import { Table as TableWrapper } from '../../ui/table';
import { Header, Body, Footer } from './index';

export default function Table({ ...attrs }) {
  return <TableWrapper {...attrs} />;
}

Table.Header = Header;
Table.Body = Body;
Table.Footer = Footer;
