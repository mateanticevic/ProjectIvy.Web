import React from 'react';
import { Container, Card, Tab, Table, ToggleButtonGroup, ToggleButton } from 'react-bootstrap';

import { Page } from '../Page';
import api from '../../api/main';
import { Brand, BrandFilters } from 'types/beer';
import { Country } from 'types/common';
import { Select } from '../../components';

interface State {
    brands: Brand[];
    brandFilters: BrandFilters;
    countries: Country[];
}

class BeerAdminPage extends Page<{}, State> {
    state: State = {
        brands: [],
        brandFilters: {},
        countries: [],
    }

    componentDidMount() {
        this.onBrandFiltersChange();
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

    onBrandFiltersChange(update?: Partial<BrandFilters>) {
        const brandFilters = {
            ...this.state.brandFilters,
            ...update,
        };
        this.setState({ brandFilters });

        api.beer
            .getBrands(brandFilters)
            .then(brands => this.setState({ brands: brands.slice(0,10) }));
    }

    render() {
        const { brands, brandFilters, countries } = this.state;
        return (
            <Container>
                <Card>
                    <Card.Header>Brands</Card.Header>
                    <Card.Body>
                        <Table>
                            {brands.map(brand =>
                                <tr key={brand.id}>
                                    <td>{brand.name}</td>
                                    <td>
                                        <Select
                                            onChange={countryId => this.onBrandChange(brand, { countryId })}
                                            options={countries}
                                            selected={brand.country?.id}
                                        />
                                    </td>
                                </tr>
                            )}
                        </Table>
                    </Card.Body>
                    <Card.Footer>
                        Has country&nbsp;
                        <ToggleButtonGroup
                            type="radio"
                            name="options"
                            defaultValue={brandFilters.hasCountry}
                            size="sm"
                            onChange={hasCountry => this.onBrandFiltersChange({ hasCountry })}
                        >
                            <ToggleButton value="">Show all</ToggleButton>
                            <ToggleButton value="true">Yes</ToggleButton>
                            <ToggleButton value="false">No</ToggleButton>
                        </ToggleButtonGroup>
                    </Card.Footer>
                </Card>
            </Container>
        );
    }
}

export default BeerAdminPage;