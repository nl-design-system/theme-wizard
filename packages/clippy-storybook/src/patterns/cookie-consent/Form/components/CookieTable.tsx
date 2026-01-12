import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableHeaderCell,
  TableRow,
} from '@utrecht/component-library-react/dist/css-module';
import React, { type FC } from 'react';
import type { Cookie } from '../types';

export interface CookieTableProps {
  cookies: Cookie[];
}

/**
 * Displays a table of cookie details including name, type, duration and description.
 */
export const CookieTable: FC<CookieTableProps> = ({ cookies }) => (
  <Table>
    <TableHeader>
      <TableRow>
        <TableHeaderCell scope="col">Cookie</TableHeaderCell>
        <TableHeaderCell scope="col">Type</TableHeaderCell>
        <TableHeaderCell scope="col">Looptijd</TableHeaderCell>
        <TableHeaderCell scope="col">Beschrijving</TableHeaderCell>
      </TableRow>
    </TableHeader>
    <TableBody>
      {cookies.map((cookie) => (
        <TableRow key={cookie.name}>
          <TableHeaderCell scope="row">{cookie.name}</TableHeaderCell>
          <TableCell>{cookie.type}</TableCell>
          <TableCell>{cookie.duration}</TableCell>
          <TableCell>{cookie.description}</TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
);
