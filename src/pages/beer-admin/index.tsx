import React from 'react';
import { Container, Card, Tab, Table } from 'react-bootstrap';

import { Page } from '../Page';
import api from '../../api/main';
import { Brand } from 'types/beer';
import { Country } from 'types/common';
import { Select } from '../../components';

interface State {
    brands: Brand[];
    countries: Country[];
}

class BeerAdminPage extends Page<{}, State> {
    state: State = {
        brands: [],
        countries: [],
    }

    componentDidMount() {
        api.beer
            .getBrands()
            .then(brands => this.setState({ brands }));
        api.country
            .getAll()
            .then(paged => this.setState({ countries: paged.items }));
    }

    onBrandChange(brand: Brand, update: Partial<Brand>) {
        const updated = {
            ...brand,
            ...update,
        };
        api.beer
            .putBrand(brand.id, updated)
            .then();
    }

    render() {
        const { brands, countries } = this.state;
        return (
            <Container>
                <Card>
                    <Card.Header>Brands</Card.Header>
                    <Card.Body>
                        <Table>
                            {brands.map(brand =>
                                <tr>
                                    <td>{brand.name}</td>
                                    <td>
                                        <Select
                                            onChange={countryId => this.onBrandChange(brand, { countryId })}
                                            options={countries}
                                            selected={brand.countryId}
                                        />
                                    </td>
                                </tr>
                            )}
                        </Table>
                    </Card.Body>
                </Card>
            </Container>
        );
    }
}

export default BeerAdminPage;