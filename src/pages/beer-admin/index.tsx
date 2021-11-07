import React from 'react';
import { Container, Card, Table, ToggleButtonGroup, ToggleButton, InputGroup, FormControl } from 'react-bootstrap';

import { Page } from 'pages/Page';
import api from 'api/main';
import { Brand, BrandFilters, Beer, Style } from 'types/beer';
import { Country } from 'types/common';
import { Select, Pagination } from 'components';

interface State {
    beerFilters: any;
    beers: any;
    brands: Brand[];
    brandFilters: BrandFilters;
    countries: Country[];
    styles: Style[];
}

class BeerAdminPage extends Page<{}, State> {
    state: State = {
        beerFilters: {
            page: 1,
            pageSize: 10,
        },
        beers: {
            count: 0,
            items: [],
        },
        brands: [],
        brandFilters: {},
        countries: [],
        styles: [],
    }

    componentDidMount() {
        this.onBrandFiltersChange();
        this.onBeerFiltersChange();

        api.country
            .getAll()
            .then(paged => this.setState({ countries: paged.items }));

        api.common
            .getBeerStyles()
            .then(styles => this.setState({ styles }));
    }

    onBeerChange(beer: Beer, update: Partial<Beer>) {
        const updated = {
            ...beer,
            ...update,
        };
        api.beer
            .putBeer(beer.id, updated)
            .then();
    }

    onBeerFiltersChange(filter?: any) {
        const beerFilters = {
            ...this.state.beerFilters,
            ...filter,
        };
        this.setState({ beerFilters });

        api.beer
            .get(beerFilters)
            .then(beers => this.setState({ beers }));
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
            .then(brands => this.setState({ brands: brands.slice(0, 10) }));
    }

    render() {
        const { beerFilters, beers, brands, brandFilters, countries, styles } = this.state;
        return (
            <Container>
                <Card>
                    <Card.Header>Brands ({brands.length})</Card.Header>
                    <Card.Body>
                        <Table>
                            {brands.map(brand =>
                                <tr key={brand.id}>
                                    <td>
                                        <FormControl
                                            type="text"
                                            defaultValue={brand.name}
                                            onChange={x => this.onBrandChange(brand, { name: x.target.value })}
                                        />
                                    </td>
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
                <Card>
                    <Card.Header>Beers ({beers.count})</Card.Header>
                    <Card.Body>
                        <Table>
                            {beers.items.map(beer =>
                                <tr key={beer.id}>
                                    <td>
                                        <FormControl
                                            type="text"
                                            defaultValue={beer.name}
                                            onChange={x => this.onBeerChange(beer, { name: x.target.value })}
                                        />
                                    </td>
                                    <td>
                                        <InputGroup>
                                            <FormControl
                                                type="number"
                                                value={beer.abv}
                                                onChange={x => this.onBeerChange(beer, { abv: x.target.value })}
                                            />
                                            <InputGroup.Text>‰</InputGroup.Text>
                                        </InputGroup>
                                    </td>
                                    <td>
                                        <Select
                                            onChange={styleId => this.onBeerChange(beer, { styleId })}
                                            options={styles}
                                            selected={beer.style?.id}
                                        />
                                    </td>
                                </tr>
                            )}
                        </Table>
                        <Pagination
                            page={beerFilters.page}
                            pages={beerFilters.pages}
                            onPageChange={page => this.onBeerFiltersChange({ page })}
                        />
                    </Card.Body>
                </Card>
            </Container>
        );
    }
}

export default BeerAdminPage;